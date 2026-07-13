from flask import Flask, render_template, request, send_file, session
import os
from werkzeug.utils import secure_filename

from modules.pipeline import run_pipeline
from modules.error_handler import SellerOSError

app = Flask(__name__)
app.secret_key = "selleros_dev"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        order = request.files["order_file"]
        bank = request.files["bank_file"]

        ALLOWED_EXTENSIONS = (".xlsx", ".xls")

        # 확장자 검사
        if not order.filename.lower().endswith(ALLOWED_EXTENSIONS):
            raise SellerOSError("EH001")

        if not bank.filename.lower().endswith(ALLOWED_EXTENSIONS):
            raise SellerOSError("EH001")

        # 안전한 파일명
        order_name = secure_filename(order.filename)
        bank_name = secure_filename(bank.filename)

        order_path = os.path.join("uploads", "orders", order_name)
        bank_path = os.path.join("uploads", "banks", bank_name)

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

    except SellerOSError as e:

        return render_template(
            "error.html",
            code=e.code,
            message=e.message
        )

    except Exception as e:

        print(e)

        return render_template(
            "error.html",
            code="EH999",
            message="프로그램 처리 중 오류가 발생했습니다."
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