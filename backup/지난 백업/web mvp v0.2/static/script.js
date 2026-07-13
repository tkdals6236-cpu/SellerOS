// =============================
// SellerOS Script (Recovery)
// =============================

const orderFile = document.getElementById("order_file");
const bankFile = document.getElementById("bank_file");

const orderDrop = document.getElementById("orderDrop");
const bankDrop = document.getElementById("bankDrop");

const orderName = document.getElementById("order-name");
const bankName = document.getElementById("bank-name");

const analyzeBtn = document.getElementById("analyzeBtn");

const allowedExtensions = [".xlsx", ".xls"];

// -------------------------
function isExcel(file) {

    return allowedExtensions.some(ext =>
        file.name.toLowerCase().endsWith(ext)
    );

}

// -------------------------
function checkFiles() {

    if (
        orderFile.files.length > 0 &&
        bankFile.files.length > 0
    ) {

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "🟢 분석 시작";

    } else {

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = "주문폼과 입금내역을 선택하세요";

    }

}

// -------------------------
function handleFile(input, label) {

    const file = input.files[0];

    if (!file)
        return;

    if (!isExcel(file)) {

        alert("엑셀 파일만 업로드 가능합니다.");

        input.value = "";
        label.innerHTML = "";

        checkFiles();

        return;

    }

    label.innerHTML = "✅ " + file.name;

    checkFiles();

}

// -------------------------
if (orderDrop) {

    orderDrop.addEventListener("click", () => {

        orderFile.click();

    });

}

if (bankDrop) {

    bankDrop.addEventListener("click", () => {

        bankFile.click();

    });

}

// -------------------------
orderFile.addEventListener("change", () => {

    handleFile(orderFile, orderName);

});

bankFile.addEventListener("change", () => {

    handleFile(bankFile, bankName);

});

// -------------------------
function setupDrop(dropArea, input, label) {

    dropArea.addEventListener("dragover", e => {

        e.preventDefault();

    });

    dropArea.addEventListener("drop", e => {

        e.preventDefault();

        const file = e.dataTransfer.files[0];

        if (!file)
            return;

        if (!isExcel(file)) {

            alert("엑셀 파일만 가능합니다.");

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

// -------------------------
document.querySelector("form").addEventListener("submit", () => {

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML = "⏳ 분석 중입니다...";

});