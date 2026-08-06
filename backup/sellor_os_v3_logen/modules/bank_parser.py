import pandas as pd

from modules.error_handler import SellerOSError


REQUIRED_COLUMNS = [

    "거래일시",

    "거래기록사항",

    "입금금액"

]


def load_bank_excel(file_path):

    # -------------------------
    # 엑셀 읽기
    # -------------------------

    try:

        df = pd.read_excel(
            file_path,
            dtype=str,
            header=11
        )

    except Exception:

        raise SellerOSError("EH006")

    # -------------------------
    # 빈 파일 검사
    # -------------------------

    if df.empty:

        raise SellerOSError("EH005")

    # -------------------------
    # 컬럼 공백 제거
    # -------------------------

    df.columns = df.columns.str.strip()

    # -------------------------
    # 필수 컬럼 검사
    # -------------------------

    for column in REQUIRED_COLUMNS:

        if column not in df.columns:

            raise SellerOSError("EH004")

    # -------------------------
    # NaN 제거
    # -------------------------

    df = df.fillna("")

    banks = []

    # -------------------------
    # 데이터 생성
    # -------------------------

    for _, row in df.iterrows():

        depositor = row["거래기록사항"].strip()

        if depositor == "":

            continue

        amount = (
            row["입금금액"]
            .replace(",", "")
            .strip()
        )

        if amount == "":

            amount = 0

        bank = {

            "datetime": row["거래일시"].strip(),

            "depositor": depositor,

            "amount": int(amount)

        }

        banks.append(bank)

    return banks