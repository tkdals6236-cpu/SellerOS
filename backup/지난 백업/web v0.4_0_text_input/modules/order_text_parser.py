def load_order_text(text):

    orders = []

    order = {}

    for line in text.splitlines():

        line = line.strip()

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

        if key == "닉네임":
            order["nickname"] = value

        elif key == "성함":
            order["depositor"] = value

        elif key == "연락처":
            order["phone"] = value

        elif key == "주소":
            order["address"] = value

        elif key == "주문상품":
            order["product"] = value

    if order:
        orders.append(order)

    return orders