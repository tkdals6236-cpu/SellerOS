from flask import Flask, render_template, request, send_file
import os
from modules.pipeline import run_pipeline

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    order = request.files["order_file"]
    bank = request.files["bank_file"]

    order_path = os.path.join("uploads", "orders", order.filename)
    bank_path = os.path.join("uploads", "banks", bank.filename)

    order.save(order_path)
    bank.save(bank_path)

    output_file, logen_file = run_pipeline(
    order_path,
    bank_path
)

    return render_template(
    "result.html",
    result_file=output_file,
    logen_file=logen_file
)
@app.route("/download/result")
def download_result():

    return send_file(
        "output/" + os.listdir("output")[0],
        as_attachment=True
    )

@app.route("/download/logen")
def download_logen():

    files = sorted(os.listdir("output"))

    return send_file(
        "output/" + files[1],
        as_attachment=True
    )

if __name__ == "__main__":
    app.run(debug=True)