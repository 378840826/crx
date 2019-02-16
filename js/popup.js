function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (callback) {
                callback(response)
            }
        })
    })
}

var popupBtn = document.querySelector('.popup-btn')
popupBtn.addEventListener('click', function() {
    var gid = document.querySelector('#id-gid').value
    var atid = document.querySelector('#id-atid').value
    var deadline = document.querySelector('#id-deadline').value
    // 发消息给 uesr
    sendMessageToContentScript({
        state: popupBtn.dataset.value,
        gid: Number(gid),
        atid: Number(atid),
        deadline: deadline,
    }, function(response) {
        console.log("来自 content 的回复：" + response)
    })
    if (popupBtn.dataset.value == 'start') {
        popupBtn.dataset.value = 'end'
        popupBtn.innerText = '停止'
    } else if (popupBtn.dataset.value == 'end') {
        popupBtn.dataset.value = 'start'
        popupBtn.innerText = '开启'
    }
})

// popup 每次关闭后都会重新加载， 需要判断当前是开启开始关闭监听的状态
// 向 user 发送消息，获取当前监听状态
sendMessageToContentScript({
    state: 'getState',
    }, function(response) {
        console.log('打开popup时收到的消息', response);
    // 设置按钮的属性
    if (response == 'start') {
        popupBtn.dataset.value = 'end'
        popupBtn.innerText = '停止'
    } else if (response == 'end') {
        popupBtn.dataset.value = 'start'
        popupBtn.innerText = '开始'
    }
})
