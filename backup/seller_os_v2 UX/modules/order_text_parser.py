import re

def load_order_text(text):

    orders = []

    order = {}

    # 다양한 필드명을 하나로 통일
    field_map = {

        "닉네임": "nickname",
        "유튜브닉네임": "nickname",
        "닉": "nickname",

        "성함": "depositor",
        "이름": "depositor",
        "받는분": "depositor",

        "연락처": "phone",
        "전화번호": "phone",
        "휴대폰": "phone",

        "주소": "address",
        "배송주소": "address",

        "주문상품": "product",
        "상품": "product",
        "주문 상품": "product"

    }

    for line in text.splitlines():

        line = line.strip()

        # 빈 줄 = 주문 종료
        if not line:

            if order:

                orders.append(order)
                order = {}

            continue

        if ":" not in line:
            continue

        key, value = line.split(":", 1)

        key = key.strip()
        value = value.strip()

        if key in field_map:

            field = field_map[key]

                # 전화번호는 숫자만 저장
            if field == "phone":

                value = re.sub(r"\D", "", value)

            if field in ("nickname", "depositor"):
                value = "".join(value.split())    

            order[field] = value

    if order:

        orders.append(order)

    return orders