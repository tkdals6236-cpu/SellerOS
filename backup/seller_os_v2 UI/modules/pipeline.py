from datetime import datetime

from modules.order_parser import load_order_excel
from modules.bank_parser import load_bank_excel
from modules.matcher import match_orders
from modules.validator import validate_results
from modules.exporter import save_result_excel
from modules.logen_exporter import export_logen_excel
from modules.logger import logger


def run_pipeline(bank_file, order_file=None, orders=None):

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    output_file = f"output/{timestamp}_검수결과.xlsx"
    logen_file = f"output/{timestamp}_로젠택배.xlsx"

    logger.divider()
    logger.write("검수 시작")

    # -------------------------
    # 주문 읽기
    # -------------------------
    if orders is None:

        if order_file is None:
            raise ValueError("주문 데이터가 없습니다.")

        orders = load_order_excel(order_file)

    # -------------------------
    # 입금 읽기
    # -------------------------
    banks = load_bank_excel(bank_file)

    # -------------------------
    # 매칭
    # -------------------------
    matched, unmatched, no_order = match_orders(
        orders,
        banks
    )
       # -------------------------
    # 검증
    # -------------------------
    results = validate_results(
        matched,
        unmatched,
        no_order
    )

    # -------------------------
    # 결과 저장
    # -------------------------
    save_result_excel(
        results,
        output_file
    )

    export_logen_excel(
        results,
        logen_file
    )

    # -------------------------
    # 통계
    # -------------------------
    matched_count = sum(
        1 for r in results
        if r["status"] == "MATCH"
    )

    unmatched_count = sum(
        1 for r in results
        if r["status"] == "NO_PAYMENT"
    )

    no_order_count = sum(
        1 for r in results
        if r["status"] == "NO_ORDER"
    )

    logger.write(f"총 주문 : {len(results)}")
    logger.write(f"입금완료 : {matched_count}")
    logger.write(f"미입금 : {unmatched_count}")
    logger.write(f"주문서없음 : {no_order_count}")

    logger.write(f"검수결과 : {output_file}")
    logger.write(f"로젠 : {logen_file}")

    logger.write("검수 완료")
    logger.divider()

    return {

        "result_file": output_file,
        "logen_file": logen_file,
        "matched": matched_count,
        "unmatched": unmatched_count,
        "no_order": no_order_count,
        "total": len(results),
        "results": results

    }