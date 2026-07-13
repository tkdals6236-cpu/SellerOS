import pandas as pd


def clean_columns(df):
    df.columns = (
        df.columns
        .str.replace("\n", "", regex=False)
        .str.replace("(*)", "", regex=False)
        .str.strip()
    )

    return df


def load_order_excel(file_path):

    df = pd.read_excel(file_path, dtype=str)
    df = clean_columns(df)

    orders = []

    for _, row in df.iterrows():

        nickname_depositor = str(row["유튜브 닉네임 및 성함"])

        # 닉네임,입금자명 분리
        if "," in nickname_depositor:
            nickname, depositor = nickname_depositor.split(",", 1)
        else:
            nickname = nickname_depositor
            depositor = ""

        order = {
            "nickname": nickname.strip(),
            "depositor": depositor.strip(),
            "product": str(row["구매한 제품 작성."]).strip(),
            "phone": str(row["연락처"]).strip(),
            "address": str(row["배송받을 주소"]).strip(),
        }

        orders.append(order)

    return orders