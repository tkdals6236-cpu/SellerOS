from config import *
from modules.pipeline import run_pipeline

order_file = f"{ORDER_FOLDER}/{ORDER_FILE}"
bank_file = f"{BANK_FOLDER}/{BANK_FILE}"

run_pipeline(
    order_file,
    bank_file
)

print("✔ 작업이 완료되었습니다.")