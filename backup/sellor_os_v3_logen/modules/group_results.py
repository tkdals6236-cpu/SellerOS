from collections import OrderedDict


def group_results(results):

    groups = OrderedDict()

    for row in results:

        # 같은 사람 묶기 (닉네임 우선, 없으면 주문자명)
        key = row["nickname"] or row["depositor"]

        if key not in groups:

            groups[key] = {

                "nickname": row["nickname"],
                "depositor": row["depositor"],

                "products": [],

                "bank_depositor": row.get("bank_depositor"),
                "amount": row.get("amount", 0),

                "status": row["status"],
                "status_text": row["status_text"]

            }

        # 상품 추가
        if row.get("product"):
            groups[key]["products"].append(row["product"])

    return list(groups.values())