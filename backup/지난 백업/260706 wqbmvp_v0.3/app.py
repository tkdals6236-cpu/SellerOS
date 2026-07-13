from flask import Flask, render_template, request, send_file
import os
from modules.pipeline import run_pipeline
from flask import session
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "selleros_dev"

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    order = request.files["order_file"]
    bank = request.files["bank_file"]

    order_path = os.path.join("uploads", "orders", order.filename)
    bank_path = os.path.join("uploads", "banks", bank.filename)

    ALLOWED_EXTENSIONS = (".xlsx", ".xls")

    if not order.filename.lower().endswith(ALLOWED_EXTENSIONS):

        return "주문폼은 엑셀 파일만 업로드 가능합니다."

    if not bank.filename.lower().endswith(ALLOWED_EXTENSIONS):

        return "입금내역은 엑셀 파일만 업로드 가능합니다."

    order.save(order_path)
    bank.save(bank_path)

    result = run_pipeline(
    order_path,
    bank_path
)

    session["result_file"] = result["result_file"]
    session["logen_file"] = result["logen_file"]

    return render_template(
    "result.html",
    total=result["total"],
    matched=result["matched"],
    unmatched=result["unmatched"],
    no_order=result["no_order"]
)

@app.route("/download/result")
def download_result():

    return send_file(
        session["result_file"],
        as_attachment=True
    )

@app.route("/download/logen")
def download_logen():

    return send_file(
        session["logen_file"],
        as_attachment=True
    )

if __name__ == "__main__":
    app.run(debug=True)