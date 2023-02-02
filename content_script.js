let extensionWindow = null;

document.addEventListener("click", function(event) {
    chrome.runtime.sendMessage({ 'preText': event.target.innerText });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    // if (request.gptEXopened === null) return;
    // if (extensionWindow === null) {
    //     window.open(
    //         chrome.extension.getURL("popup.html"),
    //         "exampleName",
    //         "width=400,height=400"
    //     );
    // } else {
    //     window.open()
    // }
});