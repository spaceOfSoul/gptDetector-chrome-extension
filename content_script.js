document.addEventListener("click", function(event) {
    // 드래그로 선택한 텍스트가 있으면 그 부분만, 없으면 클릭한 요소의 텍스트를 보낸다.
    // (드래그 후 click 이벤트는 공통 부모 요소에서 발생하므로 innerText를 쓰면 글 전체가 잡힌다.)
    const selected = window.getSelection()?.toString() ?? '';
    const text = selected.trim().length > 0 ? selected : event.target.innerText;
    if (typeof text !== 'string' || text.trim().length === 0) return;

    // 확장 프로그램을 다시 불러온 뒤 새로고침하지 않은 탭에서는 연결이 끊겨 있다.
    if (!chrome.runtime?.id) return;
    try {
        // 분석 창이 닫혀 있으면 받는 쪽이 없어서 에러가 나므로 무시한다.
        chrome.runtime.sendMessage({ 'preText': text }).catch(() => {});
    } catch (e) {
        // Extension context invalidated: 탭을 새로고침하면 다시 동작한다.
    }
});
