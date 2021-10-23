function stopRecording(chrome){
    chrome.runtime.connect().postMessage({
        messageFromContentScript1234: true,
        stopRecording: true,
        dropdown: true
    });
}
