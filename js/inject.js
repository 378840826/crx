
// 向页面插入元素用于响应事件
var crxDiv = document.createElement('div')
crxDiv.id = 'id-crx-div'
document.body.appendChild(crxDiv)
// 初始化 document.body.state 为停止状态
document.body.dataset.state = 'end'
crxDiv.addEventListener('click', function() {
    var state = document.body.dataset.state
    if (state == 'start') {
        var goodsInfo = {
            // 商品编号
            gid: document.body.dataset.gid,
            // 活动编号
            atid: document.body.dataset.atid,
            // 抢购时间
            deadline: new Date(document.body.dataset.deadline),
        }
        _main(goodsInfo)
    } else if (state == 'end') {
        _stop()
    }
})



// 参数
var options = {
    // 到加速时间后，循环添加购物车的时间间隔
    addTime: 10,
    // 加速时间 ms, 离抢购时间多少毫秒时开始加速
    speedinessTime: 4000,
    // 每次监控的间隔时间
    loopTime: 1000,
}

// 改写加购物车函数
var cart_ctl = function (tp, options) {
    cart_exists = true
    var opts = {
        action: 'updatecart',
        inajax: '1',
        pam: '',
        pam1: '',
        buynum: 1,
        buytype: '',
        tp: tp,
        show_cart: true,
        succeed_box: 0,
        hash: Math.random()
    }
    opts = $.extend(opts, options)
    $.get(reurl("share/ajax.html"), opts, function (res) {
        console.log('res:', res);
        if (res.includes('已抢完')) {
            console.log('%c 商品已抢完，停止抢购~','color:#666');
            window.clearInterval(berserkTimer)
        } else if (res.includes('抢购上限')) {
            console.log('%c 抢到了，15分钟内去付款！','background:#ccc;color:#f00');
            window.clearInterval(berserkTimer)
        }
    })
}

// 加入购物车
var addToCart = function (goodsInfo) {
    console.log('执行加购物车函数')
    window.clearInterval(timer)
    berserkTimer =  setInterval(function () {
        if (typeof cart_ctl === "function") {
            cart_ctl('add', {
                gid: goodsInfo.gid,
                buytype: 'berserk',
                pam: goodsInfo.atid,
                pam1: `${goodsInfo.gid}|1`,
                show_cart: false,
                succeed_box: 1
            })
        } else {
            console.error('cart_ctl 不是函数')
        }
    }, options.addTime)
}

// 停止监控
var _stop = function() {
    console.log('停止监控');
    window.clearInterval(timer)
}

// 开始监控
var _main = function(goodsInfo) {
    timer = setInterval(function() {
        // 现在的时间
        var now = new Date()
        // 离抢购时间还有多久
        var diffms = goodsInfo.deadline.getTime() - now.getTime()
        if (diffms <= options.speedinessTime) {
            console.log('开始加速')
            // 时间快到了，疯狂添加购物车
            addToCart(goodsInfo)
        } else {
            diffs = diffms / 1000
            var text = `剩余${parseInt(diffs / 60)}分${parseInt(diffs % 60)}秒`
            console.log(text)
        }
    }, options.loopTime)
}
