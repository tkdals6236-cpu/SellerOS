# ====================================
# SellerOS Error Handler
# ====================================

ERRORS = {

    "EH001": "엑셀(.xlsx, .xls) 파일만 업로드 가능합니다.",

    "EH002": "주문폼 양식이 올바르지 않습니다.",

    "EH003": "입금내역 양식이 올바르지 않습니다.",

    "EH004": "필수 컬럼이 없습니다.",

    "EH005": "비어있는 파일입니다.",

    "EH006": "파일이 손상되었습니다.",

    "EH007": "지원하지 않는 은행 양식입니다."

}


class SellerOSError(Exception):

    def __init__(self, code):

        self.code = code

        self.message = ERRORS.get(
            code,
            "알 수 없는 오류입니다."
        )

        super().__init__(self.message)