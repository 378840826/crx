// 向页面注入抢购代码
let addInjectScript = () => {
    let scriptStart = document.createElement('script')
    scriptStart.src = chrome.extension.getURL('js/inject.js')
    scriptStart.id = 'id-inject'
    scriptStart.onload = function() {
        scriptStart.remove()
    }
    document.head.appendChild(scriptStart)
}

// 添加监听器监听 popup 发来的消息
let addListener = () => {
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.state === 'start') {
                // 收到开启请求
                let bodyDataset = document.body.dataset
                bodyDataset.state = request.state
                bodyDataset.gid = request.gid
                bodyDataset.atid = request.atid
                bodyDataset.deadline = request.deadline
                bodyDataset.title = request.title
                bodyDataset.addTime = request.addTime
                bodyDataset.speedinessTime = request.speedinessTime
                // 触发 inject 中的开启事件
                let crxDiv = document.querySelector('#id-crx-div')
                crxDiv.click()
                sendResponse('收到开启请求')
            } else if (request.state === 'getGoodsInfo') {
                // 收到获取商品信息请求
                getGoodsIfon().then(function(goodsInfo) {
                    sendResponse(goodsInfo)
                }).catch(function(err) {
                    alert('请求1折商品信息错误')
                    console.log('请求1折商品信息错误');
                    sendResponse('error')
                })
            }
    })
}

// 获取 1 折的商品信息
let getGoodsIfon = () => {
    console.log('向 e 宠发请求获取商品信息');
    let promise = new Promise(function(resolve, reject) {
        // 判断抢购的时间批次
        let date = new Date()
        let nowHours = date.getHours()
        let time = "10:00"
        if (nowHours < 10) {
            time = "10:00"
        } else if (nowHours >= 10 && nowHours < 11) {
            time = "11:00"
        } else if (nowHours >= 11 && nowHours < 12) {
            time = "12:00"
        } else if (nowHours >= 12 && nowHours < 14) {
            time = "14:00"
        } else if (nowHours >= 14 && nowHours < 16) {
            time = "16:00"
        } else if (nowHours >= 16 && nowHours < 18) {
            time = "18:00"
        } else if (nowHours >= 18 && nowHours < 20) {
            time = "20:00"
        } else if (nowHours >= 20 && nowHours < 22) {
            time = "22:00"
        }
        // 下一批抢购的时间 deadline
        let deadline = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${time}:00`
        // 请求这个批次的抢购商品信息
        $.ajax({
            type : 'post',
            url: '/share/activitys/suprise.html?do=getNewSurprise',
            data: {time},
            async : false,
            success: function(res) {
                let div = document.createElement('ul')
                div.innerHTML = res
                let liAll = div.querySelectorAll('li')
                let goodsArr = []
                for (let i = 0; i < liAll.length; i++) {
                    let li = liAll[i]
                    // 找出 1 折的商品
                    if (li.querySelector('.cut1')) {
                        let goods = {
                            title: li.querySelector('.goodsDes').innerText,
                            imgSrc: li.querySelector('img').src,
                            gid: Number(li.querySelector('.gid').value),
                            atid: Number(li.querySelector('.atid').value),
                            deadline,
                        }
                        goodsArr.push(goods)
                    }
                }
                // 传回 1 折的商品信息数组
                resolve(goodsArr)
            },
            error: function(err) {
                reject(err)
            },
        })
    })
    return promise
}

let __main = () => {
    // 注入抢购代码
    addInjectScript()
    // 监听 popup 发来的消息
    addListener()
}

__main()
