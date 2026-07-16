import re
import pandas as pd

from modules.error_handler import SellerOSError


REQUIRED_COLUMNS = [

    "유튜브 닉네임 및 성함",

    "구매한 제품 작성.",

    "연락처",

    "배송받을 주소"

]


def clean_columns(df):

    df.columns = (
        df.columns
        .astype(str)
        .str.replace("\n", "", regex=False)
        .str.replace("(*)", "", regex=False)
        .str.strip()
    )

    return df


def load_order_excel(file_path):

    # -------------------------
    # 엑셀 읽기
    # -------------------------

    try:

        df = pd.read_excel(
            file_path,
            dtype=str
        )

    except Exception:

        raise SellerOSError("EH006")

    # -------------------------
    # 빈 파일 검사
    # -------------------------

    if df.empty:

        raise SellerOSError("EH005")

    # -------------------------
    # 컬럼 정리
    # -------------------------

    df = clean_columns(df)

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

    orders = []

    # -------------------------
    # 주문 생성
    # -------------------------

    for _, row in df.iterrows():

        nickname_depositor = str(row["유튜브 닉네임 및 성함"]).strip()

        if "," in nickname_depositor:

            nickname, depositor = nickname_depositor.split(",", 1)

        else:

            nickname = nickname_depositor
            depositor = ""

        nickname = "".join(nickname.split())

        depositor = "".join(depositor.split())

        phone = re.sub(r"\D", "", str(row["연락처"]).strip())

        order = {

            "nickname": nickname,

            "depositor": depositor,

            "product": str(row["구매한 제품 작성."]).strip(),

            "phone": phone,

            "address": str(row["배송받을 주소"]).strip()

        }

        orders.append(order)

    return orders