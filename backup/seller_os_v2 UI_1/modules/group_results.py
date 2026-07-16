from collections import OrderedDict


def group_results(results):

    groups = OrderedDict()

    for row in results:

        # 그룹 키 (닉네임 우선)
        key = row["nickname"] or row["depositor"] or row["bank_depositor"]

        if key not in groups:

            groups[key] = {

                "nickname": row["nickname"],
                "depositor": row["depositor"],

                "products": [],

                "amount": 0,

                "status": row["status"],
                "status_text": row["status_text"]

            }

        # 상품 추가
        if row["product"]:
            groups[key]["products"].append(row["product"])

        # 입금금액 누적
        if isinstance(row["amount"], (int, float)):
            groups[key]["amount"] += row["amount"]

        # 상태 갱신
        if row["status"] == "MATCH":
            groups[key]["status"] = "MATCH"
            groups[key]["status_text"] = "입금완료"

    return list(groups.values())