// 发送消息给 user 的方法
let sendMessageToUser = (message, callback) => {
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

// 获取即将抢购的商品信息(向 user 发消息获取)
let getGoodsInfo = () => {
    sendMessageToUser({
        state: 'getGoodsInfo',
    }, function(response) {
        console.log('打开popup时 请求 getGoodsInfo 时收到的消息', response);
        // 得到商品信息后，放到页面，提供选择
        var container = document.querySelector('.div-goods-container')
        var html = createGoods(response)
        container.innerHTML = html
    })
}

// 创建商品 html
let createGoods = function(goodsInfoArr) {
    if (goodsInfoArr === 'error') {
        console.log('创建商品错误');
    }
    let html = ''
    for (var i = 0; i < goodsInfoArr.length; i++) {
        let goodsInfo = goodsInfoArr[i]
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

// 点击开始抢购
let bindClickStart = () => {
    let popupBtn = document.querySelector('.popup-btn')
    popupBtn.addEventListener('click', function() {
        let gid = document.querySelector('#id-gid').value
        let atid = document.querySelector('#id-atid').value
        let deadline = document.querySelector('#id-deadline').value
        let title = document.querySelector('#id-title').innerText
        let addTime = document.querySelector('#id-addTime').value
        let speedinessTime = document.querySelector('#id-speedinessTime').value
        // 发消息给 uesr
        sendMessageToUser({
            state: 'start',
            gid: Number(gid),
            atid: Number(atid),
            deadline: deadline,
            title: title,
            addTime: addTime,
            speedinessTime: speedinessTime,
        }, function(response) {
            console.log("来自 content user 的回复：" + response)
            window.close()
        })
    })
}

// 点击图片填充 input
let bindClickGoodsImg = () => {
    // 商品点击自动填充
    var container = document.querySelector('.div-goods-container')
    container.addEventListener('click', function(event) {
        var target = event.target
        var goods = target.closest('.span-goods')
        var gid = goods.querySelector('.goods-gid').innerText
        var atid = goods.querySelector('.goods-atid').innerText
        var deadline = goods.querySelector('.goods-deadline').innerText
        var title = goods.querySelector('.goods-title').innerText
        document.querySelector('#id-gid').value = gid
        document.querySelector('#id-atid').value = atid
        document.querySelector('#id-deadline').value = deadline
        document.querySelector('#id-title').innerText = title
    })
}

let bindEvents = () => {
    bindClickStart()
    bindClickGoodsImg()
}

let __main = () => {
    // 获取商品信息
    getGoodsInfo()
    // 绑定事件
    bindEvents()
}

__main()



//
