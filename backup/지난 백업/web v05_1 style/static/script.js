// =============================
// SellerOS Script v0.3
// =============================

// 요소
const orderFile = document.getElementById("order_file");
const bankFile = document.getElementById("bank_file");

const orderDrop = document.getElementById("orderDrop");
const bankDrop = document.getElementById("bankDrop");

const orderName = document.getElementById("order-name");
const bankName = document.getElementById("bank-name");

const orderText = document.getElementById("order_text");

const analyzeBtn = document.getElementById("analyzeBtn");

const allowedExtensions = [".xlsx", ".xls"];

// -----------------------------
// Excel 검사
// -----------------------------
function isExcel(file) {

    const name = file.name.toLowerCase();

    return allowedExtensions.some(ext => name.endsWith(ext));

}

// -----------------------------
// 버튼 활성화
// -----------------------------
function checkFiles() {

    const hasOrderFile = orderFile.files.length > 0;
    const hasOrderText = orderText.value.trim() !== "";
    const hasBankFile = bankFile.files.length > 0;

    const hasOrder = hasOrderFile || hasOrderText;

    if (hasOrder && hasBankFile) {

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "🔍 검수 시작";

    }

    else if (!hasOrder && !hasBankFile) {

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = "📄 주문정보를 입력하세요";

    }

    else if (hasOrder && !hasBankFile) {

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = "💳 입금내역을 선택하세요";

    }

    else {

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = "📄 주문정보를 입력하세요";

    }

}

// -----------------------------
// 파일 선택 처리
// -----------------------------
function handleFile(input, label) {

    const file = input.files[0];

    if (!file)
        return;

    if (!isExcel(file)) {

        alert("엑셀(.xlsx / .xls) 파일만 업로드 가능합니다.");

        input.value = "";

        label.innerHTML = "";

        checkFiles();

        return;

    }

    label.innerHTML = "✅ " + file.name;

    checkFiles();

}

// -----------------------------
// 카드 클릭
// -----------------------------
orderDrop.addEventListener("click", () => {

    orderFile.click();

});

bankDrop.addEventListener("click", () => {

    bankFile.click();

});

// -----------------------------
// 파일 선택
// -----------------------------
orderFile.addEventListener("change", () => {

    handleFile(orderFile, orderName);

});

bankFile.addEventListener("change", () => {

    handleFile(bankFile, bankName);

});

// -----------------------------
// 붙여넣기 감지
// -----------------------------
if (orderText) {

    orderText.addEventListener("input", () => {

        checkFiles();

    });

}

// -----------------------------
// Drag & Drop
// -----------------------------
function setupDrop(dropArea, input, label) {

    dropArea.addEventListener("dragover", e => {

        e.preventDefault();

        dropArea.style.border = "2px solid #4CAF50";
        dropArea.style.background = "#f3fff3";

    });

    dropArea.addEventListener("dragleave", () => {

        dropArea.style.border = "";
        dropArea.style.background = "";

    });

    dropArea.addEventListener("drop", e => {

        e.preventDefault();

        const file = e.dataTransfer.files[0];

        dropArea.style.border = "";
        dropArea.style.background = "";

        if (!file)
            return;

        if (!isExcel(file)) {

            alert("엑셀(.xlsx / .xls) 파일만 업로드 가능합니다.");

            return;

        }

        const dt = new DataTransfer();

        dt.items.add(file);

        input.files = dt.files;

        handleFile(input, label);

    });

}

setupDrop(orderDrop, orderFile, orderName);
setupDrop(bankDrop, bankFile, bankName);

// -----------------------------
// 검수 시작
// -----------------------------
document.querySelector("form").addEventListener("submit", () => {

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML = "⏳ 검수 중입니다...";

});