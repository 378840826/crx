// // 参数
// let options = {
//     // 到加速时间后，循环添加购物车的时间间隔 ms
//     addTime: 10,
//     // 加速时间 s, 离抢购时间多少秒时开始加速
//     speedinessTime: 3,
// }

// 向页面插入元素用于响应事件
let appendElenemtToBody = () => {
    let crxDiv = document.createElement('div')
    crxDiv.id = 'id-crx-div'
    document.body.appendChild(crxDiv)
}

// 获取服务器时间
let getServiceTime = function () {
    // 避免缓存在 url 后面添加一个随机字符串
    let randomCode = Math.random()
    let url = `/share/ajax.html?randomCode=${randomCode}`
    let time = new Date(
        $.ajax({
            url: url,
            async: false,
        }).getResponseHeader("Date")
    )
    return time
}

// 加购物车（被循环调用）
let addGoodsTocart = function (goodsInfo, url) {
    cart_exists = true
    let opts = {
        gid: goodsInfo.gid,
        buytype: 'berserk',
        pam: goodsInfo.atid,
        pam1: `${goodsInfo.gid}|1`,
        show_cart: false,
        action: 'updatecart',
        inajax: '1',
        buynum: 1,
        tp: 'add',
        succeed_box: 1,
        hash: Math.random()
    }
    $.get(url, opts, function (res) {
        console.log(res);
        if (res.includes('已抢完')) {
            let nowServiceTime = getServiceTime()
            console.log('%c 商品已抢完，停止抢购~','color:#666', '当前服务器时间为：', nowServiceTime);
            // 延迟关闭请求
            setTimeout(function() {
                window.clearInterval(berserkTimer)
            }, 500)
        } else if (res.includes('抢购上限')) {
            console.log('%c 抢到了，15分钟内去付款！','background:#ccc;color:#f00;font-size:20px;', '当前服务器时间为：', nowServiceTime);
            // 延迟关闭请求
            setTimeout(function() {
                window.clearInterval(berserkTimer)
            }, 100)
        }
    })
}

// 循环加入购物车
let addToCart = function (goodsInfo, options) {
    console.log('开始加速，循环抢购')
    // url 放这里是避免在循环执行的 addGoodsTocart 函数中做不必要的重复执行 reurl
    var url = reurl("share/ajax.html")
    berserkTimer =  setInterval(function () {
        addGoodsTocart(goodsInfo, url)
    }, options.addTime)
}

let monitor = (goodsInfo, options) => {
    console.log(`%c准备抢购：${goodsInfo.title}`, 'color:#f00;font-size:20px;', `\n抢购开始时间为${goodsInfo.deadline}`);
    // 获取点击开启时的服务器时间和抢购时间
    let nowServiceTime = getServiceTime()
    let deadline = goodsInfo.deadline
    // 离抢购还剩下多少秒
    let time_s = (deadline - nowServiceTime) / 1000
    if (time_s < 0) {
        console.error('已经过了抢购时间')
        return false
    }
    // 因为下面的计时是 1 秒后才打印，所以 i 的初始值设为 1000 ms，time_s 也要先 -1
    let i = 1000
    time_s = time_s
    timer = setInterval(function() {
        // 每秒钟 剩余时间 -1
        time_s = time_s - 1
        // 如果快到时间了
        if (time_s <= options.speedinessTime) {
            addToCart(goodsInfo, options)
            // 停止计时
            window.clearInterval(timer)
        } else {
            let nowTimestamp = new Date(nowServiceTime).getTime() + i
            i = i + 1000
            let nowTime = new Date(nowTimestamp)
            let text = `剩余${parseInt(time_s / 60)}分${parseInt(time_s % 60)}秒   &&  当前服务器时间为 ${nowTime.getHours()}时${nowTime.getMinutes()}分${nowTime.getSeconds()}秒`
            console.log(text)
        }
    }, 1000)
}

// 点击开始
let bindClickStart = () => {
    let crxDiv = document.querySelector('#id-crx-div')
    crxDiv.addEventListener('click', function() {
        let bodyDataset = document.body.dataset
        let goodsInfo = {
            // 商品编号
            gid: bodyDataset.gid,
            // 活动编号
            atid: bodyDataset.atid,
            // 抢购时间
            deadline: new Date(bodyDataset.deadline),
            // 商品名称
            title: bodyDataset.title,
        }
        let options = {
            // 到加速时间后，循环添加购物车的时间间隔 ms
            addTime: Number(bodyDataset.addTime),
            // 加速时间 s, 离抢购时间多少秒时开始加速
            speedinessTime: Number(bodyDataset.speedinessTime),
        }
        // 限制 options
        if (options.addTime === NaN) {
            options.addTime = 100
        }
        if (options.addTime > 200) {
            options.addTime = 200
        }
        if (options.speedinessTime === NaN) {
            options.speedinessTime = 3
        }
        if (options.speedinessTime > 5) {
            options.speedinessTime = 5
        }
        // 计算 options
        options.addTime = parseInt(1000 / options.addTime)
        options.speedinessTime = parseInt(options.speedinessTime)
        monitor(goodsInfo, options)
    })
}

let bindEvents = () => {
    bindClickStart()
}

let __main = () => {
    appendElenemtToBody()
    bindEvents()
}

__main()
