const textbox = document.querySelector('#textFiled');
const openButton = document.querySelector('#window-open');

let last_submit = null;

textbox.oninput = () => {
    if (last_submit) {
        clearTimeout(last_submit);
    }
    if (textbox.value.length === 0) {
        update_graph(null);
        return;
    }
    last_submit = setTimeout(() => {
        if (textbox.value.length === 0) {
            update_graph(null);
            return;
        }
        //서버에 리퀘스트
        analysisRequest(textbox.value);
    }, 1000);

};

window.addEventListener('DOMContentLoaded', () => {
    bar.style.width = "50%";
    textbox.focus();
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.preText === null) return;
    textbox.value = request.preText;
    analysisRequest(textbox.value);
});

openButton.addEventListener('click', (e) => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        height: 534,
        width: 524
    });
})