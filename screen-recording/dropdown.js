var runtimePort = chrome.runtime.connect({
    name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

runtimePort.onMessage.addListener(function(message) {
    if (!message || !message.messageFromContentScript1234) {
        return;
    }
});

var isRecording = false;
chrome.storage.sync.get('isRecording', function(obj) {
    document.getElementById('default-section').style.display = obj.isRecording === 'true' ? 'none' : 'block';
    document.getElementById('stop-section').style.display = obj.isRecording === 'true' ? 'block' : 'none';

    isRecording = obj.isRecording === 'true';
    if (isRecording === true) {
        document.getElementById('stop-recording').click();

        chrome.tabs.query({}, function(tabs) {
        var tabIds = [];
        var url = 'chrome-extension://' + chrome.runtime.id + '/video.html';
        for (var i = tabs.length - 1; i >= 0; i--) {
            if (tabs[i].url === url) {
                tabIds.push(tabs[i].id);
                chrome.tabs.update(tabs[i].id, {
                    active: true,
                    url: url
                });
                break;
            }
        }
        if (tabIds.length) {
            chrome.tabs.remove(tabIds);
        }
    });
    }
});

document.getElementById('stop-recording').onclick = function() {
    chrome.storage.sync.set({
        isRecording: 'false'
    }, function() {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            stopRecording: true,
            dropdown: true
        });
        window.close();
    });
};


document.getElementById('selected-tab').onclick = function() {
    let value = document.getElementById('minutesrecording').value;
    let minutes = Number(value);
    if (minutes<= 0){
        alert("minutes invalid. number need >=0");
        window.close();      

    }else{
        chrome.storage.sync.set({
            enableTabCaptureAPI: 'true',
            enableTabCaptureAPIAudioOnly: 'false',
            enableMicrophone: 'false',
            enableCamera: 'false',
            enableScreen: 'false',
            isRecording: 'true',
            enableSpeakers: 'false'
        }, function() {
            let milsec = minutes*60*1000
            runtimePort.postMessage({
                messageFromContentScript1234: true,
                timeToRecording: milsec,
                startRecording: true,
                dropdown: true
            });
        });
    }
    
};

document.getElementById('btn-options').onclick = function(e) {
    e.preventDefault();
    location.href = this.href;
};
