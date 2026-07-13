import re
import pandas as pd
import shutil
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
        header=None,
        dtype=str
    )

 
    except Exception as e:

        print(e)
        raise

    # -------------------------
    # 빈 파일 검사
    # -------------------------

    if df.empty:

        raise SellerOSError("EH005")

    # -------------------------
    # 컬럼 정리
    # -------------------------

    df = clean_columns(df)

    print("컬럼명:", list(df.columns))

    # -------------------------
    # 필수 컬럼 검사
    # -------------------------

    for column in REQUIRED_COLUMNS:

        if column not in df.columns:

            raise Exception(
                f"EH004\n"
                f"찾는 컬럼 : {column}\n"
                f"실제 컬럼 : {list(df.columns)}"
        )
    # -------------------------
    # NaN 제거
    # -------------------------

    df = df.fillna("")

    orders = []

    # -------------------------
    # 주문 생성
    # -------------------------

    for _, row in df.iterrows():

        nickname_depositor = row["유튜브 닉네임 및 성함"].strip()

        if "," in nickname_depositor:

            nickname, depositor = nickname_depositor.split(",", 1)

        else:

            nickname = nickname_depositor
            depositor = ""

        # -------------------------
        # 데이터 정규화
        # -------------------------

        nickname = nickname.strip()

        # 입금자명 공백 제거
        depositor = "".join(depositor.split())

        # 전화번호 숫자만 저장
        phone = re.sub(r"\D", "", row["연락처"].strip())

        order = {

            "nickname": nickname,

            "depositor": depositor,

            "product": row["구매한 제품 작성."].strip(),

            "phone": phone,

            "address": row["배송받을 주소"].strip()

        }

        orders.append(order)

    return orders