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
# 버전 : 1.0.0
# ====================================

STATUS_INFO = {

    "MATCH": {
        "text": "입금완료",
        "message": ""
    },

    "NO_PAYMENT": {
        "text": "미입금",
        "message": "입금내역이 없습니다."
    },

    "NO_ORDER": {
        "text": "주문서없음",
        "message": "주문정보가 없습니다."
    }

}


STATUS_ORDER = {

    "MATCH": 0,

    "NO_PAYMENT": 1,

    "NO_ORDER": 2

}


def make_result(
    status,
    nickname="",
    depositor="",
    bank_depositor="",
    product="",
    phone="",
    address="",
    amount="",
    datetime=""
):

    return {

        "status": status,

        "status_text": STATUS_INFO[status]["text"],

        "message": STATUS_INFO[status]["message"],

        "nickname": nickname,

        "depositor": depositor,
        "bank_depositor": bank_depositor,
        "product": product,

        "phone": phone,

        "address": address,

        "amount": amount,

        "datetime": datetime

    }


def validate_results(matched, unmatched, no_order):

    results = []

    # ------------------------
    # 입금완료
    # ------------------------

    for item in matched:

        results.append(

            make_result(

                "MATCH",

                nickname=item["order"]["nickname"],

                depositor=item["order"]["depositor"],
                bank_depositor=item["bank"]["depositor"],

                product=item["order"]["product"],

                phone=item["order"]["phone"],

                address=item["order"]["address"],

                amount=item["bank"]["amount"],

                datetime=item["bank"]["datetime"]

            )

        )

    # ------------------------
    # 미입금
    # ------------------------

    for item in unmatched:

        results.append(

            make_result(

                "NO_PAYMENT",

                nickname=item["nickname"],

                depositor=item["depositor"],

                product=item["product"],

                phone=item["phone"],

                address=item["address"]

            )

        )

    # ------------------------
    # 주문서 없음
    # ------------------------

    for item in no_order:

        results.append(

            make_result(

                "NO_ORDER",

                depositor=item["depositor"],
                bank_depositor=item["depositor"],

                amount=item["amount"],

                datetime=item["datetime"]

            )

        )

    # ------------------------
    # 정렬
    # ------------------------

    results.sort(

        key=lambda x: (

            STATUS_ORDER[x["status"]],

            x["nickname"],

            x["product"],

            x["depositor"]

        )

    )

    return results