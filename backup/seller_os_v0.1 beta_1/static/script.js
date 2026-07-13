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
const orderSummary =
    document.getElementById("orderSummary");

const analyzeBtn = document.getElementById("analyzeBtn");

const allowedExtensions = [".xlsx", ".xls"];

const loadingTitle =
    document.getElementById("loadingTitle");

const loadingDesc =
    document.getElementById("loadingDesc");


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

    // ------------------------------------
    // 주문파일 업로드 시 직접입력 비활성화
    // ------------------------------------
    if (hasOrderFile) {
        
        orderText.value="";
        
        orderText.disabled = true;
    
        orderText.placeholder =
            "주문파일이 업로드되어 있습니다.\n\n파일을 삭제한 후 주문내용을 직접 입력해주세요.";
    
        orderSummary.innerHTML =
            '📝 주문내용 직접 입력 <span class="optional">(비활성)</span>';
    
    }
    else{
    
        orderText.disabled = false;
    
        orderText.placeholder =
            "여기에 주문 내용을 Ctrl + V로 붙여넣으세요.";
    
        orderSummary.innerHTML =
            '📝 주문내용 직접 입력 <span class="optional">(선택)</span>';
    
    }

    // ------------------------------------
    // 주문 엑셀 + 입금
    // ------------------------------------
    if (hasOrderFile && hasBankFile) {

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "🔍 자동 검수 시작";

    }

    // ------------------------------------
    // 주문 직접입력 + 입금
    // ------------------------------------
    else if (hasOrderText && hasBankFile) {

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "🔍 주문+입금 자동 검수";

    }

    // ------------------------------------
    // 주문 엑셀만
    // ------------------------------------
    else if (hasOrderFile) {

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = "💳 입금내역을 업로드하세요";

    }

    // ------------------------------------
    // 주문 직접입력만
    // ------------------------------------
    else if (hasOrderText) {

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "📋 주문목록 만들기";

    }

    // ------------------------------------
    // 입금만
    // ------------------------------------
    else if (hasBankFile) {

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = "📄 주문정보를 입력하세요";

    }

    // ------------------------------------
    // 아무것도 없음
    // ------------------------------------
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

    label.innerHTML = `
    <div class="file-selected">

        <div class="file-name">

            ✅ ${file.name}

        </div>

        <div class="file-actions">

            <button type="button"
                    class="mini-btn"
                    onclick="changeFile(event,'${input.id}')">

                📁 파일 변경

            </button>

            <button type="button"
                    class="mini-btn delete-btn"
                    onclick="removeFile(event,'${input.id}')">

                🗑 삭제

            </button>

        </div>

</div>
`;

checkFiles();
}

// -----------------------------
// 카드 클릭
// -----------------------------
orderDrop.addEventListener("click", () => {

    if (orderText.value.trim() !== "") {

        alert("주문내용 직접 입력이 있습니다.\n\n내용을 삭제한 후 주문파일을 업로드해주세요.");
        orderText.focus();
        return;

    }

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

        // 주문내용 직접입력이 있으면 주문파일 업로드 금지
    if (input.id === "order_file" && orderText.value.trim() !== "") {

    alert("주문내용 직접 입력이 있습니다.\n\n내용을 삭제한 후 주문파일을 업로드해주세요.");

    dropArea.style.border = "";
    dropArea.style.background = "";

    return;

}

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
// 실행 시작
// -----------------------------
document.querySelector("form").addEventListener("submit", () => {

    analyzeBtn.disabled = true;

    // 주문목록 생성
    if (analyzeBtn.innerHTML.includes("주문목록")) {

        analyzeBtn.innerHTML =
            "📋 주문목록 생성 중입니다...";

        loadingTitle.innerHTML =
            "📋 주문목록을 생성하고 있습니다.";

        loadingDesc.innerHTML =
            "주문 내용을 정리하고 있습니다.<br>잠시만 기다려주세요.";

    }

    // 자동 검수
    else {

        analyzeBtn.innerHTML =
            "🔍 주문과 입금내역을 확인하는 중입니다...";

        loadingTitle.innerHTML =
            "🔍 자동 검수를 진행하고 있습니다.";

        loadingDesc.innerHTML =
            "주문과 입금내역을 비교하고 있습니다.<br>잠시만 기다려주세요.";

    }

});
// -----------------------------
// 파일 제거
// -----------------------------
function removeFile(event, inputId) {

    event.stopPropagation();

    if (inputId === "order_file") {

        orderFile.value = "";
        orderName.innerHTML = "";
    
        orderText.disabled = false;
    
        orderText.placeholder =
            "여기에 주문 내용을 Ctrl + V로 붙여넣으세요.";
    
    }

    else if (inputId === "bank_file") {

        bankFile.value = "";
        bankName.innerHTML = "";

    }

    checkFiles();

}
// -----------------------------
// 파일 변경
// -----------------------------
function changeFile(event, inputId){

    event.stopPropagation();

    if(inputId==="order_file"){

        if(orderText.value.trim()!==""){

            alert("주문내용 직접 입력이 있습니다.\n\n내용을 삭제한 후 주문파일을 업로드해주세요.");
        
            orderText.focus();
        
            return;
        
        }

        orderFile.click();

    }

    else{

        bankFile.click();

    }

}