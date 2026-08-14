const preview = document.getElementById("previewImage");
const excel = document.getElementById("excelPreview");

let currentExcelFile = null;
let excelData = [];


// =====================================================
// 엑셀 저장 버튼
// =====================================================

const previewCard = excel.parentElement;

const excelToolbar = document.createElement("div");

excelToolbar.id = "excelToolbar";
excelToolbar.style.display = "none";
excelToolbar.style.marginBottom = "10px";

excelToolbar.innerHTML = `
    <button id="saveExcelBtn">
        💾 수정 내용 저장
    </button>
`;

previewCard.insertBefore(
    excelToolbar,
    excel
);


// =====================================================
// 파일 선택
// =====================================================

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


        // 선택한 파일 삭제 버튼만 표시
        btn.parentElement
            .querySelector(".delete-btn")
            .style.display = "inline-flex";


        const file = btn.dataset.file;
        const ext = file.split(".").pop().toLowerCase();


        // =================================================
        // 이미지
        // =================================================

        if (
            ["jpg", "jpeg", "png", "gif", "webp", "bmp"]
                .includes(ext)
        ) {

            excelToolbar.style.display = "none";

            excel.style.display = "none";

            preview.style.display = "block";

            preview.src =
                "/uploads/files/" +
                encodeURIComponent(file);

            return;
        }


        // =================================================
        // 엑셀
        // =================================================

        if (
            ["xlsx", "xls", "csv"]
                .includes(ext)
        ) {

            preview.style.display = "none";

            excel.style.display = "block";

            excelToolbar.style.display = "flex";

            currentExcelFile = file;

            excel.innerHTML =
                "엑셀 불러오는 중...";


            fetch(
                "/excel_data/" +
                encodeURIComponent(file)
            )
            .then(res => res.json())
            .then(data => {

                if (data.error) {

                    excel.innerHTML =
                        data.error;

                    return;
                }

                loadExcelData(data);

                renderExcel();

            })
            .catch(err => {

                console.error(err);

                excel.innerHTML =
                    "엑셀 파일을 불러오지 못했습니다.";

            });

        }

    });

});


// =====================================================
// 데이터 변환
// =====================================================

function loadExcelData(data) {

    excelData = [];


    // 최소 8열
    const maxCols =
        Math.max(
            data.max_col || 0,
            8
        );


    for (
        let row = 1;
        row <= data.max_row;
        row++
    ) {

        let rowData = [];


        for (
            let col = 1;
            col <= maxCols;
            col++
        ) {

            rowData.push(
                data.cells[row]?.[col] ?? ""
            );

        }


        excelData.push(rowData);

    }


    // 데이터가 아예 없는 경우
    if (excelData.length === 0) {

        excelData.push(
            Array(maxCols).fill("")
        );

    }

}


// =====================================================
// 엑셀 화면 만들기
// =====================================================

function renderExcel() {

    excel.innerHTML = "";


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "excel-wrapper";


    const table =
        document.createElement("table");

    table.className =
        "editable-excel";


    // =================================================
    // 헤더
    // 첫 번째 엑셀 행을 컬럼명으로 사용
    // =================================================

    const thead =
        document.createElement("thead");

    const headerRow =
        document.createElement("tr");


    // 좌측 모서리
    const corner =
        document.createElement("th");

    corner.className =
        "excel-corner";

    headerRow.appendChild(corner);


    const columnCount =
        getMaxCols();


    for (
        let col = 0;
        col < columnCount;
        col++
    ) {

        const th =
            document.createElement("th");


        // 실제 엑셀 첫 번째 행의 값
        th.textContent =
            excelData[0]?.[col] ?? "";


        th.contentEditable =
            "true";


        th.dataset.col =
            col;


        // 컬럼명 수정
        th.addEventListener(
            "input",
            () => {

                if (!excelData[0]) {

                    excelData[0] = [];

                }


                excelData[0][col] =
                    th.textContent;

            }
        );


        headerRow.appendChild(th);

    }


    thead.appendChild(headerRow);

    table.appendChild(thead);


    // =================================================
    // 데이터
    // 첫 번째 행은 컬럼명이므로 제외
    // =================================================

    const tbody =
        document.createElement("tbody");


    for (
        let row = 1;
        row < excelData.length;
        row++
    ) {

        const tr =
            document.createElement("tr");


        // 실제 엑셀 행 번호
        const rowNumber =
            document.createElement("th");


        rowNumber.textContent =
            row + 1;


        rowNumber.className =
            "excel-row-number";


        tr.appendChild(rowNumber);


        // 셀
        for (
            let col = 0;
            col < columnCount;
            col++
        ) {

            const td =
                document.createElement("td");


            td.contentEditable =
                "true";


            td.textContent =
                excelData[row]?.[col] ?? "";


            td.dataset.row =
                row;


            td.dataset.col =
                col;


            // 셀 수정
            td.addEventListener(
                "input",
                () => {

                    if (!excelData[row]) {

                        excelData[row] = [];

                    }


                    excelData[row][col] =
                        td.textContent;

                }
            );


            tr.appendChild(td);

        }


        tbody.appendChild(tr);

    }


    table.appendChild(tbody);

    wrapper.appendChild(table);

    excel.appendChild(wrapper);

}


// =====================================================
// 최대 열 개수
// =====================================================

function getMaxCols() {

    let max = 8;


    for (
        const row of excelData
    ) {

        if (
            row &&
            row.length > max
        ) {

            max = row.length;

        }

    }


    return max;

}


// =====================================================
// 엑셀 저장
// =====================================================

document
    .getElementById("saveExcelBtn")
    .addEventListener(
        "click",
        () => {

            if (!currentExcelFile) {

                return;

            }


            const saveButton =
                document.getElementById(
                    "saveExcelBtn"
                );


            saveButton.disabled =
                true;


            saveButton.textContent =
                "저장 중...";


            fetch(
                "/save_excel",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        filename:
                            currentExcelFile,

                        data:
                            excelData

                    })

                }
            )
            .then(res => res.json())
            .then(data => {

                if (data.success) {

                    alert(
                        "엑셀 파일이 저장되었습니다."
                    );

                } else {

                    alert(
                        data.error ||
                        "저장에 실패했습니다."
                    );

                }

            })
            .catch(err => {

                console.error(err);

                alert(
                    "저장 중 오류가 발생했습니다."
                );

            })
            .finally(() => {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "💾 수정 내용 저장";

            });

        }
    );
