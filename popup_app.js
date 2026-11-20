import { analysisRequest, preloadModel } from './analsisText.js';

const eTxt = document.querySelector('.judgeText');

preloadModel();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const text = request.preText;
    if (typeof text !== 'string' || text.trim().length === 0) return;
    eTxt.innerText = text;
    analysisRequest(text);
});
