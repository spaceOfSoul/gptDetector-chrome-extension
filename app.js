import { analysisRequest, update_graph, bar, preloadModel } from './analsisText.js';

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
        //로컬 모델로 분석
        analysisRequest(textbox.value);
    }, 1000);

};

bar.style.width = "50%";
textbox.focus();
preloadModel();
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