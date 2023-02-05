const eTxt = document.querySelector('.judgeText');

function analysisRequest(txt) {
    const req = new XMLHttpRequest();
    req.open('GET', "https://openai-openai-detector.hf.space" + '/?' + txt, true);
    req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status !== 200) throw new Error("HTTP status: " + req.status);
        let result = JSON.parse(req.responseText);
        console.log(result);
        update_graph(result);
    };
    req.send();
}

window.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ 'gptEXopened': true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.preText === null) return;
    eTxt.innerText = request.preText;
    analysisRequest(request.preText);
});