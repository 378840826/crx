// 发送消息给 user 的方法
const sendMessageToUser = (message, callback) => {
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
const getGoodsInfo = () => {
    sendMessageToUser({
        state: 'getGoodsInfo',
    }, function(response) {
        console.log('打开popup时 请求 getGoodsInfo 时收到的消息', response);
        // 得到商品信息后，放到页面，提供选择
        let container = document.querySelector('.div-goods-container')
        let html = createGoods(response)
        container.innerHTML = html
    })
}

// 创建商品 html
const createGoods = function(goodsInfoArr) {
    if (goodsInfoArr === 'error') {
        console.log('创建商品错误');
    }
    let html = ''
    for (let i = 0; i < goodsInfoArr.length; i++) {
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

// 在 scopeElement 上删除所有名为 className 的 classs
const removeClassAll = (className, scopeElement) => {
    var selector = '.' + className
    if (scopeElement) {
        var elements = scopeElement.querySelectorAll(selector)
    } else {
        var elements = document.querySelectorAll(selector)
    }
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

// 点击开始抢购
const bindClickStart = () => {
    let popupBtn = document.querySelector('.popup-btn')
    popupBtn.addEventListener('click', function() {
        let gid = document.querySelector('#id-gid').value
        let atid = document.querySelector('#id-atid').value
        let deadline = document.querySelector('#id-deadline').value
        let title = document.querySelector('#id-title').innerText
        let frequency = document.querySelector('#id-frequency').value
        let speedinessTime = document.querySelector('#id-speedinessTime').value
        if (gid === '' || atid === '' || deadline === '') {
            document.querySelector('.p-error').innerText = '开启前先点击图片选择商品'
            return
        }
        // 发消息给 uesr
        sendMessageToUser({
            state: 'start',
            gid: Number(gid),
            atid: Number(atid),
            deadline: deadline,
            title: title,
            frequency: frequency,
            speedinessTime: speedinessTime,
        }, function(response) {
            console.log("来自 content user 的回复：" + response)
            window.close()
        })
    })
}

// 点击图片填充 input
const bindClickGoodsImg = () => {
    // 商品点击自动填充
    let container = document.querySelector('.div-goods-container')
    container.addEventListener('click', function(event) {
        let target = event.target
        let goodsSpan = target.closest('.span-goods')
        let scopeElement = document.querySelector('.div-goods-container')
        removeClassAll('active', scopeElement)
        goodsSpan.classList.add('active')
        let goods = target.closest('.span-goods')
        let gid = goods.querySelector('.goods-gid').innerText
        let atid = goods.querySelector('.goods-atid').innerText
        let deadline = goods.querySelector('.goods-deadline').innerText
        let title = goods.querySelector('.goods-title').innerText
        document.querySelector('#id-gid').value = gid
        document.querySelector('#id-atid').value = atid
        document.querySelector('#id-deadline').value = deadline
        document.querySelector('#id-title').innerText = title
    })
}

const bindEvents = () => {
    bindClickStart()
    bindClickGoodsImg()
}

const __main = () => {
    // 获取商品信息
    getGoodsInfo()
    // 绑定事件
    bindEvents()
}

__main()



//
