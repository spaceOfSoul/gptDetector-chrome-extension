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
    const text = request.preText;
    if (typeof text !== 'string' || text.trim().length === 0) return;
    textbox.value = text;
    analysisRequest(textbox.value);
});

// sidePanel.open()은 사용자 클릭 직후 바로 호출해야 하므로 창 ID를 미리 구해 둔다.
let currentWindowId = null;
chrome.windows.getCurrent().then((w) => { currentWindowId = w.id; });

openButton.addEventListener('click', (e) => {
    // 사이드 패널은 브라우저 옆에 붙어 있어서 페이지를 클릭해도 뒤로 숨지 않는다.
    if (chrome.sidePanel && currentWindowId !== null) {
        chrome.sidePanel.open({ windowId: currentWindowId })
            .then(() => window.close())
            .catch((err) => {
                console.error(err);
                openPopupWindow();
            });
        return;
    }
    openPopupWindow();
});

// 사이드 패널을 쓸 수 없는 구버전 Chrome용
function openPopupWindow() {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        height: 534,
        width: 524
    });
}
