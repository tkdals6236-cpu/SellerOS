def match_orders(orders, banks):

    matched = []
    unmatched = []
    no_order = []

    # 이미 사용된 입금내역 번호 저장
    used_bank_indexes = set()

    for order in orders:

        is_matched = False

        for idx, bank in enumerate(banks):

            # 이미 다른 주문과 매칭된 입금은 건너뜀
            if idx in used_bank_indexes:
                continue

            # 입금자명 또는 닉네임으로 매칭
            if (
                order["depositor"] == bank["depositor"]
                or
                order["nickname"] == bank["depositor"]
            ):

                matched.append({

                    "order": order,

                    "bank": bank

                })

                used_bank_indexes.add(idx)

                is_matched = True

                break

        if not is_matched:

            unmatched.append(order)

    # ------------------------
    # 주문서 없는 입금 찾기
    # ------------------------

    for idx, bank in enumerate(banks):

        if idx not in used_bank_indexes:

            no_order.append(bank)

    return matched, unmatched, no_order