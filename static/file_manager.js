const preview = document.getElementById("previewImage");
const excel = document.getElementById("excelPreview");

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
        if (["jpg","jpeg","png","gif","webp","bmp"].includes(ext)) {

            excel.style.display = "none";
            preview.style.display = "block";
            preview.src = "/uploads/files/" + file;

        }

        // 엑셀
        else if (["xlsx","xls","csv"].includes(ext)) {

            preview.style.display = "none";
            excel.style.display = "block";

            fetch("/excel_preview/" + encodeURIComponent(file))
                .then(res => res.text())
                .then(html => {
                    excel.innerHTML = html;
                });

        }

    });

});