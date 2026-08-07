const logo = document.getElementById("sellerLogo");

let pressTimer = null;

// 길게 누르기 시작
function startPress() {

    pressTimer = setTimeout(() => {

        window.location.href = "/panel_4d9a1f";

    }, 3000);

}

// 손 떼면 취소
function cancelPress() {

    clearTimeout(pressTimer);

}

// PC
logo.addEventListener("mousedown", startPress);
logo.addEventListener("mouseup", cancelPress);
logo.addEventListener("mouseleave", cancelPress);

// 모바일
logo.addEventListener("touchstart", startPress);
logo.addEventListener("touchend", cancelPress);
logo.addEventListener("touchcancel", cancelPress);