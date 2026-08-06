def match_orders(orders, banks):

    matched = []
    unmatched = []
    no_order = []

    # ------------------------
    # 사람별 입금내역 생성
    # ------------------------

    bank_map = {}

    for bank in banks:

        name = bank["depositor"].strip()

        if name not in bank_map:
            bank_map[name] = []

        bank_map[name].append(bank)

    used_bank_names = set()

    # ------------------------
    # 주문 검사
    # ------------------------

    for order in orders:

        matched_bank = None

        # 주문자명 우선
        if order["depositor"] in bank_map:

            matched_bank = bank_map[order["depositor"]][0]
            used_bank_names.add(order["depositor"])

        # 닉네임도 검사
        elif order["nickname"] in bank_map:

            matched_bank = bank_map[order["nickname"]][0]
            used_bank_names.add(order["nickname"])

        if matched_bank:

            matched.append({

                "order": order,
                "bank": matched_bank

            })

        else:

            unmatched.append(order)

    # ------------------------
    # 주문서 없는 입금
    # ------------------------

    for bank in banks:

        if bank["depositor"] not in used_bank_names:

            no_order.append(bank)

    return matched, unmatched, no_order