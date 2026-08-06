import os
import pandas as pd


IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp"
]

EXCEL_EXTENSIONS = [
    ".xlsx",
    ".xls",
    ".csv"
]


def image_preview(filename):

    return {
        "type": "image",
        "src": f"/uploads/files/{filename}"
    }


def excel_preview(file_path):

    df = pd.read_excel(file_path)

    df = df.head(20)

    return {
        "type": "excel",
        "html": df.to_html(
            index=False,
            classes="excel-table"
        ),
        "rows": len(df)
    }


def get_preview(filename):

    ext = os.path.splitext(filename)[1].lower()

    file_path = os.path.join(
        "uploads",
        "files",
        filename
    )

    if ext in IMAGE_EXTENSIONS:
        return image_preview(filename)

    if ext in EXCEL_EXTENSIONS:
        return excel_preview(file_path)

    return {
        "type": "unknown"
    }