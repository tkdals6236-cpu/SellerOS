const preview = document.getElementById("previewImage");
const excel = document.getElementById("excelPreview");
const excelToolbar = document.getElementById("excelToolbar");
const saveExcelBtn = document.getElementById("saveExcelBtn");

let currentExcelFile = null;
let editedCells = {};

document.querySelectorAll(".preview-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        // 선택 강조
        document.querySelectorAll(".preview-btn").forEach(b => {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        // 모든 삭제 버튼 숨김
        document.querySelectorAll(".delete-btn").forEach(del => {
            del.style.display = "none";
        });

        // 선택한 파일의 삭제 버튼만 표시
        btn.parentElement
            .querySelector(".delete-btn")
            .style.display = "inline-flex";

        const file = btn.dataset.file;
        const ext = file.split(".").pop().toLowerCase();

        // 이미지
        if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) {

            excelToolbar.style.display = "none";
            excel.style.display = "none";
            preview.style.display = "block";

            preview.src = "/uploads/files/" + encodeURIComponent(file);

        }

        // 엑셀
        else if (["xlsx", "xls", "csv"].includes(ext)) {

            preview.style.display = "none";
            excel.style.display = "block";
            excelToolbar.style.display = "block";

            currentExcelFile = file;
            editedCells = {};

            excel.innerHTML = "불러오는 중...";

            fetch("/excel_data/" + encodeURIComponent(file))
                .then(res => res.json())
                .then(data => {

                    if (data.error) {
                        excel.innerHTML = data.error;
                        return;
                    }

                    renderExcel(data);

                })
                .catch(err => {

                    console.error(err);

                    excel.innerHTML =
                        "엑셀 파일을 불러오지 못했습니다.";

                });

        }

    });

});


function renderExcel(data) {

    excel.innerHTML = "";

    const table = document.createElement("table");

    table.className = "editable-excel";

    // 헤더
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const corner = document.createElement("th");
    corner.textContent = "#";
    headerRow.appendChild(corner);

    for (let col = 1; col <= data.max_col; col++) {

        const th = document.createElement("th");

        th.textContent = columnName(col);

        headerRow.appendChild(th);

    }

    thead.appendChild(headerRow);
    table.appendChild(thead);


    // 데이터
    const tbody = document.createElement("tbody");

    for (let row = 1; row <= data.max_row; row++) {

        const tr = document.createElement("tr");

        const rowNumber = document.createElement("th");

        rowNumber.textContent = row;

        tr.appendChild(rowNumber);


        for (let col = 1; col <= data.max_col; col++) {

            const td = document.createElement("td");

            const value =
                data.cells[row]?.[col] ?? "";

            td.textContent = value;

            td.contentEditable = "true";

            td.dataset.row = row;
            td.dataset.col = col;

            td.addEventListener("input", () => {

                const key = `${row}:${col}`;

                editedCells[key] = td.textContent;

            });

            tr.appendChild(td);

        }

        tbody.appendChild(tr);

    }

    table.appendChild(tbody);

    excel.appendChild(table);

}


function columnName(num) {

    let name = "";

    while (num > 0) {

        let remainder = (num - 1) % 26;

        name =
            String.fromCharCode(65 + remainder) + name;

        num =
            Math.floor((num - 1) / 26);

    }

    return name;

}


// 저장
saveExcelBtn.addEventListener("click", () => {

    if (!currentExcelFile) {
        return;
    }

    if (Object.keys(editedCells).length === 0) {

        alert("수정된 내용이 없습니다.");

        return;

    }

    saveExcelBtn.disabled = true;
    saveExcelBtn.textContent = "저장 중...";


    fetch("/save_excel", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            filename: currentExcelFile,

            cells: editedCells

        })

    })

    .then(res => res.json())

    .then(data => {

        if (data.success) {

            alert("엑셀 수정 내용이 저장되었습니다.");

            editedCells = {};

        } else {

            alert(
                data.error ||
                "저장에 실패했습니다."
            );

        }

    })

    .catch(err => {

        console.error(err);

        alert("저장 중 오류가 발생했습니다.");

    })

    .finally(() => {

        saveExcelBtn.disabled = false;
        saveExcelBtn.textContent = "💾 수정 내용 저장";

    });

});
