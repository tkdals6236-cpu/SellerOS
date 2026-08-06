import re
from collections import Counter
from modules.validators import (
    validate_phone,
    validate_address,
)


def is_valid_value(field, value):

    value = value.strip()

    if field == "phone":

        phone = re.sub(r"\D", "", value)

        return len(phone) in (10, 11)

    if field == "address":

        keywords = [
            "시", "군", "구",
            "읍", "면", "동",
            "로", "길"
        ]

        return any(k in value for k in keywords)

    return True

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
    "주문 상품": "product",
}

def validate_field(field, value):

    if field == "phone":
        return validate_phone(value)

    if field == "address":
        return validate_address(value)

    return True


def normalize_order_text(text):

    review_orders = []

    patterns = []

    # -------------------
    # 안내문 제거
    # -------------------

    lines = []

    for line in text.splitlines():

        line = line.strip()

        if line.startswith("##"):
            continue

        lines.append(line)

    text = "\n".join(lines)

    # -------------------
    # 주문 블록 분리
    # -------------------

    blocks = []
    block = []

    for line in text.splitlines():

        if line.strip() == "":

            if block:
                blocks.append(block)
                block = []

            continue

        block.append(line)

    if block:
        blocks.append(block)

    # -------------------
    # 블록 분석
    # -------------------

    for i, block in enumerate(blocks, start=1):

        label_count = sum(1 for line in block if ":" in line)

        order_type = "label" if label_count >= 2 else "sequence"

        print(f"주문 {i} : {order_type}")

        if order_type == "label":

            pattern = []

            for line in block:

                if ":" not in line:
                    continue

                key = line.split(":", 1)[0].strip()

                if key in field_map:
                    pattern.append(field_map[key])

            patterns.append(tuple(pattern))

            print("패턴 :", pattern)

    # -------------------
    # 대표 패턴
    # -------------------

    if patterns:

        counter = Counter(patterns)

        representative_pattern = counter.most_common(1)[0][0]

        print("\n========== 대표 패턴 ==========")

        for i, field in enumerate(representative_pattern, start=1):
            print(f"{i}. {field}")

        print("===============================\n")

        # -------------------
    # sequence → label 변환
    # -------------------

    if patterns:

        label_name = {
            "nickname": "닉네임",
            "depositor": "성함",
            "phone": "연락처",
            "address": "주소",
            "product": "주문상품"
        }

        normalized_blocks = []

        for block in blocks:

            label_count = sum(1 for line in block if ":" in line)

            order_type = "label" if label_count >= 2 else "sequence"

            # 라벨 주문은 그대로 사용
            if order_type == "label":

                normalized_blocks.append("\n".join(block))
                continue

            # 줄 개수가 다르면 변환하지 않음
            if len(block) != len(representative_pattern):

                print("⚠️ 확인 필요 :", block)

                normalized_blocks.append("\n".join(block))
                continue

            # 라벨 붙이기
            new_block = []

            valid = True

            for field, value in zip(representative_pattern, block):

                if not validate_field(field, value):

                    print(f"⚠️ 확인 필요 ({field}) : {value}")

                    valid = False
                    break

                label = label_name[field]

                new_block.append(f"{label} : {value}")

            if valid:
                normalized_blocks.append("\n".join(new_block))
            else:
                review_orders.append({
                    "reason": f"{field} 위치 오류",
                    "text": "\n".join(block)
    })

        return "\n\n".join(normalized_blocks), review_orders

        print("\n========== 변환 후 ==========")
        print(text)
        print("============================\n")

    return text