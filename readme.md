4.0改版，atid 抢购前不能获取

    时间快到之后 停止倒计时
    循环获取 atid

    提示达到抢购上限实际并没有抢到
    需要通过返回添加成功的 html 来判断

    获取 atid 改为异步
    增加获取速度

    抢完提示不确定是否真的抢完，延迟 10 秒关闭抢购

    请求到抢购 html 代码后，格式化为 DOM 树后再判断的操作耗时太多
    改为字符串判断

4.1 改版，atid 获取方式变了
    获取抢购商品的地址变了

4.2 请求可能被拦截
