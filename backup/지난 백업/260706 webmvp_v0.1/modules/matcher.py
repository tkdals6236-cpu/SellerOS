def match_orders(orders, banks):

    matched = []
    unmatched = []
    no_order = []
    used_banks = []

    for order in orders:

        found = False

        for bank in banks:

            if order["depositor"] == bank["depositor"]:

                found = True

                matched.append({
                    "order": order,
                    "bank": bank
                })

                used_banks.append(bank)

                break

        if not found:
            unmatched.append(order)

    # ------------------------
    # 주문서 없는 입금 찾기
    # ------------------------
    for bank in banks:

        if bank not in used_banks:
            no_order.append(bank)

    return matched, unmatched, no_order