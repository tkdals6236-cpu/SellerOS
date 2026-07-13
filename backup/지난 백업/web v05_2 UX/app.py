from flask import Flask, render_template, request, send_file, session
import os
from werkzeug.utils import secure_filename

from modules.pipeline import run_pipeline
from modules.error_handler import SellerOSError
from modules.order_text_parser import load_order_text
from modules.order_parser import load_order_excel

app = Flask(__name__)
app.secret_key = "selleros_dev"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        order = request.files.get("order_file")
        bank = request.files["bank_file"]

        order_text = request.form.get("order_text", "").strip()

        ALLOWED_EXTENSIONS = (".xlsx", ".xls")

        # -------------------------
        # 입금내역은 반드시 있어야 함
        # -------------------------
        if not bank.filename.lower().endswith(ALLOWED_EXTENSIONS):
            raise SellerOSError("EH001")

        bank_name = secure_filename(bank.filename)
        bank_path = os.path.join("uploads", "banks", bank_name)

        bank.save(bank_path)

        # -------------------------
        # 주문 읽기
        # -------------------------

        if order and order.filename:

            if not order.filename.lower().endswith(ALLOWED_EXTENSIONS):
                raise SellerOSError("EH001")

            order_name = secure_filename(order.filename)

            order_path = os.path.join(
                "uploads",
                "orders",
                order_name
            )

            order.save(order_path)

            orders = load_order_excel(order_path)

        elif order_text:

            orders = load_order_text(order_text)

        else:

            raise SellerOSError("EH001")

        # -------------------------
        # 검수 실행
        # -------------------------

        result = run_pipeline(
            bank_file=bank_path,
            orders=orders
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