const eTxt = document.querySelector('.judgeText');

window.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ 'gptEXopened': true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.preText === null) return;
    eTxt.innerText = request.preText;
    analysisRequest(request.preText);
});