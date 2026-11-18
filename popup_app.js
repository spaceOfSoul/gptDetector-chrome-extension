import { analysisRequest, preloadModel } from './analsisText.js';

const eTxt = document.querySelector('.judgeText');

chrome.runtime.sendMessage({ 'gptEXopened': true });
preloadModel();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.preText === null) return;
    eTxt.innerText = request.preText;
    analysisRequest(request.preText);
});