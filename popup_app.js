import { analysisRequest, preloadModel } from './analsisText.js';

const eTxt = document.querySelector('.judgeText');

function showAndAnalyze(text) {
    if (typeof text !== 'string' || text.trim().length === 0) return;
    eTxt.innerText = text;
    analysisRequest(text);
}

preloadModel();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    showAndAnalyze(request.preText);
});

// 우클릭 메뉴로 패널이 열린 경우, 열리는 동안 전달하지 못한 선택 텍스트를 가져온다.
chrome.runtime.sendMessage({ type: 'getPendingText' })
    .then(showAndAnalyze)
    .catch(() => {});
