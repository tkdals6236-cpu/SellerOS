from config import *
from modules.validator import validate_results
from modules.order_parser import load_order_excel
from modules.bank_parser import load_bank_excel
from modules.matcher import match_orders
from modules.exporter import save_result_excel
from modules.logen_exporter import export_logen_excel
from datetime import datetime
import warnings

warnings.filterwarnings(
    "ignore",
    category=UserWarning,
    module="openpyxl"
)

print("=" * 50)
print(f"SellerOS v{VERSION}")
print("=" * 50)

today = datetime.now().strftime("%m%d")

order_file = f"{ORDER_FOLDER}/{ORDER_FILE}"
bank_file = f"{BANK_FOLDER}/{BANK_FILE}"

orders = load_order_excel(order_file)

if DEBUG:
    print("\n===== 주문 데이터 =====")
    for order in orders:
        print(order)

banks = load_bank_excel(bank_file)

if DEBUG:
    print("\n===== 입금 데이터 =====")
    for bank in banks:
        print(bank)

matched, unmatched, no_order = match_orders(orders, banks)

if DEBUG:
    print("\n===== 입금 완료 =====")

    for item in matched:
        print(item)

    print("\n===== 미입금 =====")

    for item in unmatched:
        print(item)   

results = validate_results(
    matched,
    unmatched,
    no_order
)
if DEBUG:
    print("\n===== Validator =====")

    for result in results:
        print(result)

        
output_file = f"output/{today}_검수결과.xlsx"

save_result_excel(results, output_file)

export_logen_excel(
    results,
    f"output/{today}_로젠택배.xlsx"
)

print("✔ 검수결과 엑셀 생성 완료")
print("✔ 로젠택배 엑셀 생성 완료")
print("작업이 완료되었습니다.")    

