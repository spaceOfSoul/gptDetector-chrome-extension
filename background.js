const MENU_ID = 'gpt-detector-analyze-selection';

// 사이드 패널이 아직 열리는 중이면 메시지를 받을 수 없으므로, 패널이 로드된 뒤 가져가도록 보관해 둔다.
let pendingText = null;

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: MENU_ID,
            title: 'Check with GPT Detector: "%s"',
            contexts: ['selection'],
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== MENU_ID || !info.selectionText) return;

    // sidePanel.open()은 사용자 동작 직후에 호출해야 하므로 다른 await보다 먼저 부른다.
    if (tab?.windowId !== undefined) {
        chrome.sidePanel.open({ windowId: tab.windowId }).catch(console.error);
    }

    pendingText = info.selectionText;
    // 패널이 이미 열려 있으면 바로 전달된다.
    chrome.runtime.sendMessage({ preText: info.selectionText })
        .then(() => { pendingText = null; })
        .catch(() => {});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getPendingText') {
        sendResponse(pendingText);
        pendingText = null;
    }
});
