document.addEventListener("click", function(event) {
    chrome.runtime.sendMessage({ 'preText': event.target.innerText });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.gptEXopened === null) return;
});