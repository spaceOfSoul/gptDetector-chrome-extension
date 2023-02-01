document.addEventListener("click", function(event) {
    console.log(event.target.innerText);
    chrome.runtime.sendMessage(event.target.innerText);
});