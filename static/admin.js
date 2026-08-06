const logo = document.getElementById("sellerLogo");

let clickCount = 0;
let timer = null;

logo.addEventListener("click", () => {

    clickCount++;

    clearTimeout(timer);

    timer = setTimeout(() => {
        clickCount = 0;
    }, 2000);

    if (clickCount >= 7) {

        clickCount = 0;

        window.location.href = "/panel_4d9a1f";

    }

});