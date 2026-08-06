import re


def validate_phone(value):

    phone = re.sub(r"\D", "", value)

    return len(phone) in (10, 11)


def validate_address(value):

    value = value.strip()

    # 전화번호가 주소 자리에 들어오면 실패
    phone = re.sub(r"\D", "", value)

    if len(phone) in (10, 11):
        return False

    # 너무 짧으면 의심
    if len(value) < 4:
        return False

    return True