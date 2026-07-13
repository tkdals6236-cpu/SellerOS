from datetime import datetime

from modules.order_parser import load_order_excel
from modules.bank_parser import load_bank_excel
from modules.matcher import match_orders
from modules.validator import validate_results
from modules.exporter import save_result_excel
from modules.logen_exporter import export_logen_excel


def run_pipeline(order_file, bank_file):

    today = datetime.now().strftime("%m%d")

    output_file = f"output/{today}_검수결과.xlsx"
    logen_file = f"output/{today}_로젠택배.xlsx"

    # 주문 읽기
    orders = load_order_excel(order_file)

    # 입금 읽기
    banks = load_bank_excel(bank_file)

    # 매칭
    matched, unmatched, no_order = match_orders(
        orders,
        banks
    )

    # 검증
    results = validate_results(
        matched,
        unmatched,
        no_order
    )

    # 엑셀 저장
    save_result_excel(
        results,
        output_file
    )

    export_logen_excel(
        results,
        logen_file
    )

    matched_count = sum(1 for r in results if r["status"] == "MATCH")
    unmatched_count = sum(1 for r in results if r["status"] == "NO_PAYMENT")
    no_order_count = sum(1 for r in results if r["status"] == "NO_ORDER")

    return {
    "result_file": output_file,
    "logen_file": logen_file,
    "matched": matched_count,
    "unmatched": unmatched_count,
    "no_order": no_order_count,
    "total": len(results)

}