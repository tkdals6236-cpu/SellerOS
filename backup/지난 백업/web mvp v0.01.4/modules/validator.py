# ====================================
# SellerOS Validator Module
# ====================================
#
# 역할
# - Matcher 결과를 검증한다.
# - 출력하기 좋은 형태로 데이터를 정리한다.
# - 상태(Status)를 부여한다.
#
# 작성 : 김상민
# 버전 : 0.0.3
# ====================================

def validate_results(matched, unmatched, no_order):

    results = []

    for item in matched:

        result = {

            "status": "MATCH",

            "nickname": item["order"]["nickname"],

            "depositor": item["order"]["depositor"],

            "product": item["order"]["product"],

            "phone": item["order"]["phone"],

            "address": item["order"]["address"],

            "amount": item["bank"]["amount"],

            "datetime": item["bank"]["datetime"]

        }

        results.append(result)

    # ------------------------
    # 미입금
    # ------------------------

    for item in unmatched:

        result = {

        "status": "NO_PAYMENT",

        "nickname": item["nickname"],

        "depositor": item["depositor"],

        "product": item["product"],

        "phone": item["phone"],

        "address": item["address"],

        "amount": "",

        "datetime": ""

    }

        results.append(result)

    for item in no_order:

        result = {

        "status": "NO_ORDER",

        "nickname": "",

        "product": "",

        "depositor": item["depositor"],

        "amount": item["amount"],

        "phone": "",

        "address": "",

        "datetime": item["datetime"]

    }

    results.append(result)   

    # ------------------------
    # 닉네임순 정렬
    # ------------------------
    status_order = {
    "MATCH": 0,
    "NO_PAYMENT": 1,
    "NO_ORDER": 2
}

    results.sort(
    key=lambda x: (
        status_order[x["status"]],
        x["nickname"],
        x["depositor"]
    )
)

    return results