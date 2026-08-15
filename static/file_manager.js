const preview = document.getElementById("previewImage");
const excel = document.getElementById("excelPreview");

let currentExcelFile = null;
let excelData = [];


// =====================================================
// 엑셀 헤더
// =====================================================

let excelHeaders = [
    "제품명",
    "단가",
    "예비입고",
    "입고수량",
    "재고",
    "판매수량",
    "판매금액",
    "비고"
];


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
        const deleteBtn =
            btn.parentElement.querySelector(".delete-btn");

        if (deleteBtn) {
            deleteBtn.style.display = "inline-flex";
        }


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
            excelToolbar.style.display = "block";

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

    const maxCols = Math.max(
        data.max_col || 0,
        8
    );


    // 실제 데이터 전부 유지
    for (
        let row = 1;
        row <= (data.max_row || 0);
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

        // 최소 8열
        while (rowData.length < 8) {
            rowData.push("");
        }

        excelData.push(rowData);

    }


    // 데이터가 아예 없는 경우
    if (excelData.length === 0) {

        excelData.push(
            Array(8).fill("")
        );

    }


    // 최소 50행 데이터 배열 확보
    while (excelData.length < 50) {

        excelData.push(
            Array(8).fill("")
        );

    }


    // =================================================
    // 1~48행 상품 데이터 기본값
    // =================================================

    for (let row = 0; row < 48; row++) {

        if (!excelData[row]) {
            excelData[row] =
                Array(8).fill("");
        }

        while (excelData[row].length < 8) {
            excelData[row].push("");
        }

        // 제품명이 있는 행만 입고수량 기본값 0
const productName = String(excelData[row][0] || "").trim();

if (
    productName !== "" &&
    (
        excelData[row][3] === null ||
        excelData[row][3] === undefined ||
        excelData[row][3] === ""
    )
) {
    excelData[row][3] = "0";
}
        // 불필요한 0 제거
if (productName === "") {

    for (let col = 1; col <= 6; col++) {
        excelData[row][col] = "";
    }

} else {

    // 제품이 있는 행도 입고수량 외의 0은 빈칸
    for (let col of [1, 2, 4, 5, 6]) {

        if (
            String(excelData[row][col]).trim() === "0"
        ) {
            excelData[row][col] = "";
        }

    }

    // 입고수량은 항상 0
    if (
        excelData[row][3] === "" ||
        excelData[row][3] === null ||
        excelData[row][3] === undefined
    ) {
        excelData[row][3] = "0";
    }
}

    }


    // =================================================
    // 49행
    // =================================================

    if (!excelData[48]) {

        excelData[48] =
            Array(8).fill("");

    }

    while (excelData[48].length < 8) {
        excelData[48].push("");
    }


    // =================================================
    // 50행
    // =================================================

    if (!excelData[49]) {

        excelData[49] =
            Array(8).fill("");

    }

    while (excelData[49].length < 8) {
        excelData[49].push("");
    }

}


// =====================================================
// 엑셀 화면 만들기
// =====================================================

function renderExcel() {

    excel.innerHTML = "";


    // 바깥 스크롤 영역
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
    // =================================================

    const thead =
        document.createElement("thead");

    const headerRow =
        document.createElement("tr");


    // 왼쪽 모서리
    const corner =
        document.createElement("th");

    corner.className =
        "excel-corner";

    corner.textContent =
        "";

    headerRow.appendChild(corner);


    const columnCount =
        8;


    // 컬럼 헤더
    for (
        let col = 0;
        col < columnCount;
        col++
    ) {

        const th =
            document.createElement("th");

        th.textContent =
            excelHeaders[col] || "";

        th.contentEditable =
            "true";

        th.dataset.col =
            col;

        th.className =
            "excel-header";


        // 헤더 수정
        th.addEventListener(
            "input",
            () => {

                excelHeaders[col] =
                    th.textContent;

            }
        );


        headerRow.appendChild(th);

    }


    thead.appendChild(headerRow);

    table.appendChild(thead);


    // =================================================
    // 데이터
    // =================================================

    const tbody =
        document.createElement("tbody");


    // 정확히 50행
    const displayRows = 50;


    for (
        let row = 0;
        row < displayRows;
        row++
    ) {

        const tr =
            document.createElement("tr");


        // =================================================
        // 행 번호
        // =================================================

        const rowNumber =
            document.createElement("th");

        rowNumber.textContent =
            row + 1;

        rowNumber.className =
            "excel-row-number";

        tr.appendChild(rowNumber);


        // =================================================
        // 49행 / 50행 특수 처리
        // =================================================

        if (row === 48) {

            renderSummaryRow(
                tr,
                row
            );

            tbody.appendChild(tr);

            continue;
        }


        if (row === 49) {

            renderStockTotalRow(
                tr,
                row
            );

            tbody.appendChild(tr);

            continue;
        }


        // =================================================
        // 상품 셀
        // =================================================

        for (
            let col = 0;
            col < columnCount;
            col++
        ) {

            const td =
                document.createElement("td");

            td.contentEditable =
                "true";

            td.className =
                "excel-cell";

            td.dataset.row =
                row;

            td.dataset.col =
                col;


            // =================================================
            // 값 표시
            // =================================================

            let value = "";

            if (
                excelData[row] &&
                excelData[row][col] !== undefined
            ) {

                value =
                    excelData[row][col];

            }


            // 제품명이 있는 행만 입고수량 기본값 0
if (
    col === 3 &&
    String(excelData[row][0] || "").trim() !== "" &&
    (
        value === null ||
        value === undefined ||
        value === ""
    )
) {
    value = "0";
    excelData[row][col] = "0";
}


// 숫자 컬럼 처음 표시할 때 콤마
if (
    [1, 2, 3, 4, 5, 6]
        .includes(col)
) {

    const number =
        parseNumber(value);

    if (value !== "") {

        value =
            formatNumber(number);

        excelData[row][col] =
            value;

    }

}


            td.textContent =
                value;


            // =================================================
            // 판매금액은 자동 계산
            // =================================================

            if (col === 6) {

                updateSalesAmount(
                    row
                );

            }


            // =================================================
            // 셀 수정
            // =================================================

            td.addEventListener(
                "input",
                () => {

                    if (!excelData[row]) {

                        excelData[row] =
                            Array(8).fill("");

                    }


                    while (
                        excelData[row].length < 8
                    ) {

                        excelData[row].push("");

                    }


                    // 현재 셀 저장
                    excelData[row][col] =
                        td.textContent;

                    // 제품명을 새로 입력하면 입고수량을 0으로 표시
if (
    col === 0 &&
    td.textContent.trim() !== "" &&
    !excelData[row][3]
) {

    excelData[row][3] = "0";

    const inputCell =
        document.querySelector(
            `td[data-row="${row}"][data-col="3"]`
        );

    if (inputCell) {
        inputCell.textContent = "0";
    }
}




                    // 단가 또는 판매수량 변경
                    if (
                        col === 1 ||
                        col === 5
                    ) {

                        updateSalesAmount(
                            row
                        );

                    }

                }
            );
        // 숫자 입력이 끝났을 때만 콤마 적용
    td.addEventListener("blur", () => {

        const numericCols = [
            1, 2, 3, 4, 5, 6
        ];

        if (!numericCols.includes(col)) {
            return;
        }

        const rawValue =
    td.textContent.trim();

// 빈칸이면 0으로 바꾸지 않음
if (rawValue === "") {

    excelData[row][col] = "";

    return;
}

const number =
    parseNumber(rawValue);

if (!isNaN(number)) {

    const formatted =
        formatNumber(number);

    td.textContent =
        formatted;

    excelData[row][col] =
        formatted;
}

        if (
            col === 1 ||
            col === 5
        ) {

            updateSalesAmount(row);

        }

        updateSummaryRow();

    });
  
            tr.appendChild(td);

        }


        tbody.appendChild(tr);

    }


    table.appendChild(tbody);

    wrapper.appendChild(table);

    excel.appendChild(wrapper);


    // 49행 계산 표시
    updateSummaryRow();

}


// =====================================================
// 49행
//
// A = 합계금액
// B = 전체 판매금액
// C = 입금액
// D = 직접 입력
// E = 잔액
// F = 합계금액 - 입금액
// =====================================================

function renderSummaryRow(tr, row) {

    const values = [
        "합계금액",
        "",
        "입금액",
        "",
        "잔액",
        "",
        "",
        ""
    ];


    for (
        let col = 0;
        col < 8;
        col++
    ) {

        const td =
            document.createElement("td");

        td.dataset.row =
            row;

        td.dataset.col =
            col;


        // 라벨
        if (
            col === 0 ||
            col === 2 ||
            col === 4
        ) {

            td.textContent =
                values[col];

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-label";

        }


        // 합계금액
        else if (col === 1) {

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-value";

        }


        // 입금액
        else if (col === 3) {

            td.contentEditable =
                "true";

            td.className =
                "excel-summary-input";

            td.textContent =
                excelData[48][3] || "";


            td.addEventListener(
    "input",
    () => {

        // 입력 중에는 값을 그대로 저장
        // 커서가 튀지 않도록 즉시 콤마 처리하지 않음
        excelData[48][3] =
            td.textContent;

        // 입금액 입력 중에는 합계/잔액만 갱신
        updateSummaryRow();

    }
);


// 입력이 끝났을 때만 콤마 적용
td.addEventListener(
    "blur",
    () => {

        const amount =
            parseNumber(
                td.textContent
            );

        if (!isNaN(amount)) {

            const formatted =
                formatNumber(amount);

            td.textContent =
                formatted;

            excelData[48][3] =
                formatted;
        }

        updateSummaryRow();

    }
);

        }


        // 잔액
        else if (col === 5) {

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-value";

        }


        else {

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-empty";

        }


        tr.appendChild(td);

    }

}


// =====================================================
// 50행
//
// A = 재고금액
// B = 단가 × 재고 전체 합계
// =====================================================

function renderStockTotalRow(tr, row) {

    for (
        let col = 0;
        col < 8;
        col++
    ) {

        const td =
            document.createElement("td");

        td.dataset.row =
            row;

        td.dataset.col =
            col;


        if (col === 0) {

            td.textContent =
                "재고금액";

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-label";

        }

        else if (col === 1) {

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-value";

            td.textContent =
                formatNumber(
                    calculateStockTotal()
                );

        }

        else {

            td.textContent =
                "";

            td.contentEditable =
                "false";

            td.className =
                "excel-summary-empty";

        }


        tr.appendChild(td);

    }

}


// =====================================================
// 숫자 변환
// =====================================================

function parseNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    return Number(
        String(value)
            .replace(/,/g, "")
            .trim()
    );

}


// =====================================================
// 숫자 콤마 표시
// =====================================================

function formatNumber(value) {

    const number =
        Number(value);


    if (isNaN(number)) {

        return "0";

    }


    return number.toLocaleString(
        "ko-KR"
    );

}


// =====================================================
// 판매금액 자동 계산
//
// 단가 × 판매수량
// =====================================================

function updateSalesAmount(row) {

    if (!excelData[row]) {

        return;

    }


    const price =
        parseNumber(
            excelData[row][1]
        );


    const salesQty =
        parseNumber(
            excelData[row][5]
        );


    const salesAmount =
        price * salesQty;


    excelData[row][6] =
        formatNumber(
            salesAmount
        );


    const cell =
        document.querySelector(
            `td[data-row="${row}"][data-col="6"]`
        );


    if (cell) {

        cell.textContent =
            formatNumber(
                salesAmount
            );

    }

}


// =====================================================
// 전체 판매금액
// =====================================================

function calculateSalesTotal() {

    let total = 0;


    for (
        let row = 0;
        row < 48;
        row++
    ) {

        if (!excelData[row]) {
            continue;
        }


        const price =
            parseNumber(
                excelData[row][1]
            );


        const salesQty =
            parseNumber(
                excelData[row][5]
            );


        total +=
            price * salesQty;

    }


    return total;

}


// =====================================================
// 전체 재고금액
//
// 단가 × 재고
// =====================================================

function calculateStockTotal() {

    let total = 0;


    for (
        let row = 0;
        row < 48;
        row++
    ) {

        if (!excelData[row]) {
            continue;
        }


        const price =
            parseNumber(
                excelData[row][1]
            );


        const stock =
            parseNumber(
                excelData[row][4]
            );


        total +=
            price * stock;

    }


    return total;

}


// =====================================================
// 49행 업데이트
// =====================================================

function updateSummaryRow() {

    const totalSales =
        calculateSalesTotal();


    const deposit =
        parseNumber(
            excelData[48]?.[3]
        );


    const balance =
        totalSales - deposit;


    const totalCell =
        document.querySelector(
            'td[data-row="48"][data-col="1"]'
        );


    const balanceCell =
        document.querySelector(
            'td[data-row="48"][data-col="5"]'
        );


    if (totalCell) {

        totalCell.textContent =
            formatNumber(
                totalSales
            );

    }


    if (balanceCell) {

        balanceCell.textContent =
            formatNumber(
                balance
            );

    }


    // 50행 재고금액
    const stockCell =
        document.querySelector(
            'td[data-row="49"][data-col="1"]'
        );


    if (stockCell) {

        stockCell.textContent =
            formatNumber(
                calculateStockTotal()
            );

    }

}


// =====================================================
// 최대 열 개수
// =====================================================

function getMaxCols() {

    return 8;

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


            // 49행 최신 입금액 반영
            updateSummaryRow();


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


                    // 서버에서 저장된 최신 데이터 다시 불러오기
                    return fetch(
                        "/excel_data/" +
                        encodeURIComponent(
                            currentExcelFile
                        )
                    );

                }


                throw new Error(
                    data.error ||
                    "저장에 실패했습니다."
                );

            })
            .then(res => {

                if (!res) {
                    return;
                }

                return res.json();

            })
            .then(data => {

                if (!data) {
                    return;
                }


                if (!data.error) {

                    loadExcelData(
                        data
                    );

                    renderExcel();

                }

            })
            .catch(err => {

                console.error(err);

                alert(
                    err.message ||
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
