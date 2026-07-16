from collections import OrderedDict


def group_preview(rows):

    groups = OrderedDict()

    for row in rows:

        key = row.get("nickname") or row.get("depositor")

        if key not in groups:

            groups[key] = {
                "nickname": row.get("nickname", ""),
                "depositor": row.get("depositor", ""),
                "products": [],
                
                "phone": row.get("phone", ""),
                "address": row.get("address", "")
            }

        if row.get("product"):
            groups[key]["products"].append(row["product"])

    return list(groups.values())