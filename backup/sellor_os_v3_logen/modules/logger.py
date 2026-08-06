# ====================================
# SellerOS Logger
# ====================================

from datetime import datetime
import os

LOG_FOLDER = "logs"


class Logger:

    def __init__(self):

        os.makedirs(LOG_FOLDER, exist_ok=True)

        today = datetime.now().strftime("%Y-%m-%d")

        self.file = os.path.join(
            LOG_FOLDER,
            f"{today}.log"
        )

    def write(self, text):

        now = datetime.now().strftime("%H:%M:%S")

        with open(
            self.file,
            "a",
            encoding="utf-8"
        ) as f:

            f.write(f"[{now}] {text}\n")

    def divider(self):

        with open(
            self.file,
            "a",
            encoding="utf-8"
        ) as f:

            f.write("=" * 60 + "\n")


logger = Logger()