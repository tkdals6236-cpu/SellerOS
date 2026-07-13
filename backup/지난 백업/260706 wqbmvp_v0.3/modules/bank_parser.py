import pandas as pd


def load_bank_excel(file_path):

    df = pd.read_excel(
        file_path,
        dtype=str,
        header=11
    )

    banks = []

    for _, row in df.iterrows():

        # 입금자명이 없으면 건너뛴다.
        if pd.isna(row["거래기록사항"]):
            continue

        bank = {
            "datetime": str(row["거래일시"]).strip(),
            "depositor": str(row["거래기록사항"]).strip(),
            "amount": int(str(row["입금금액"]).replace(",", "").strip())
        }

        banks.append(bank)

    return banks