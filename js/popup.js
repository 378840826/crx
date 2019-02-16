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
        console.log("来自 content user 的回复：" + response)
    })
    // 改变开关状态
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
        console.log('打开popup时 请求 getState 收到的消息', response);
    // 设置按钮的属性
    if (response == 'start') {
        popupBtn.dataset.value = 'end'
        popupBtn.innerText = '停止'
    } else if (response == 'end') {
        popupBtn.dataset.value = 'start'
        popupBtn.innerText = '开始'
    }
})

// 向 user 发送消息，获取当前抢购信息
sendMessageToContentScript({
    state: 'getGoodsInfo',
    }, function(response) {
        console.log('打开popup时 请求 getGoodsInfo 时收到的消息', response);
        // 得到商品信息后，放到页面，提供选择
        var container = document.querySelector('.div-goods-container')
        var html = createGoods(response)
        container.innerHTML = html
})

// 创建商品html
var createGoods = function(goodsInfoArr) {
    var html = ''
    for (var i = 0; i < goodsInfoArr.length; i++) {
        var goodsInfo = goodsInfoArr[i]
        html += `
            <span class="span-goods">
                <div class="goods-title">${goodsInfo.title}</div>
                <div class="goods-img">
                    <img src="${goodsInfo.imgSrc}">
                </div>
                <div class="goods-number">
                    <span class="span-goods-gid">
                        gid: <span class="goods-gid">${goodsInfo.gid}</span>
                    </span>
                    <span class="span-goods-atid">
                        atid: <span class="goods-atid">${goodsInfo.atid}</span>
                    </span>
                    <span class="span-deadline">
                        抢购时间: <span class="goods-deadline">${goodsInfo.deadline}</span>
                    </span>
                </div>
            </span>`
    }
    return html
}

// 商品点击自动填充
var container = document.querySelector('.div-goods-container')
container.addEventListener('click', function(event) {
    var target = event.target
    var goods = target.closest('.span-goods')
    var gid = goods.querySelector('.goods-gid').innerText
    var atid = goods.querySelector('.goods-atid').innerText
    var deadline = goods.querySelector('.goods-deadline').innerText
    document.querySelector('#id-gid').value = gid
    document.querySelector('#id-atid').value = atid
    document.querySelector('#id-deadline').value = deadline
})






//
