from modules.order_text_parser import load_order_text

text = """
닉네임 : 김씨
성함 : 홍길동
연락처 : 01012345678
주소 : 경기도 안산시
주문상품 : 크롬하츠안경

닉네임 : 김씨2
성함 : 홍길동2
연락처 : 01012345679
주소 : 경기도 안양시
주문상품 : 파타고니아 상의 XL
"""

orders = load_order_text(text)

for order in orders:
    print(order)