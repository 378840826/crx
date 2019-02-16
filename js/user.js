var scriptStart = document.createElement('script')
scriptStart.src = chrome.extension.getURL('js/inject.js')
scriptStart.id = 'id-inject'
scriptStart.onload = function() {
    scriptStart.remove()
}
document.head.appendChild(scriptStart)

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        var crxDiv = document.querySelector('#id-crx-div')
        if (request.state == 'start') {
            document.body.dataset.state = request.state
            document.body.dataset.gid = request.gid
            document.body.dataset.atid = request.atid
            document.body.dataset.deadline = request.deadline
            crxDiv.click()
            sendResponse('收到开启请求')
        } else if (request.state == 'end') {
            document.body.dataset.state = request.state
            crxDiv.click()
            sendResponse('收到停止请求')
        } else if (request.state == 'getState') {
            // 返回当前的监听状态给 popup
            var state = document.body.dataset.state
            console.log('收到popup查询状态的请求', state);
            sendResponse(state)
        } else if (request.state == 'getGoodsInfo') {
            getNowGoodsIfon().then(function(goodsInfo) {
                sendResponse(goodsInfo)
            })
        }
})

// 获取即将抢购的商品的信息
var getNowGoodsIfon = function() {
    var date = new Date()
    var nowHours = date.getHours()
    var time = "10:00"
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
    var deadline = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${time}:00`
    var promise = new Promise(function(resolve, reject) {
        $.ajax({
            type : 'post',
            url: '/share/activitys/suprise.html?do=getNewSurprise',
            data: {time},
            async : false,
            success: function(res) {
                var div = document.createElement('ul')
                div.innerHTML = res
                var liAll = div.querySelectorAll('li')
                var goodsArr = []
                for (var i = 0; i < liAll.length; i++) {
                    var li = liAll[i]
                    // 找出 1 折的商品
                    if (li.querySelector('.cut1')) {
                        var goods = {
                            title: li.querySelector('.goodsDes').innerText,
                            imgSrc: li.querySelector('img').src,
                            gid: Number(li.querySelector('.gid').value),
                            atid: Number(li.querySelector('.atid').value),
                            deadline: deadline,
                        }
                        goodsArr.push(goods)
                    }
                }

                var goodsInfo = goodsArr
                resolve(goodsInfo)
            },
        })
    })
    return promise
}
