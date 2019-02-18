1 当前时间改为服务器时间
2 根据时间自动获取商品信息，并提供选择
3 暂停功能
4 把所有的参数都放到 popup 设置


暂停功能
    在 body 中插入一个元素用于绑定事件
    点击开始或者暂停后，触发这个事件


1 首先在 body 中加入一个 crxDiv 用作开始、停止的开关
2 打开 popup 时，判断当前是否已经开启，开关信息放在 body.dataset.state 中，初始化 body.dataset.state 为 end
    popup 无法获取 body
    每次打开 popup 时发消息给 user ，让 user 获取 body.dataset.state， 返回给 popup
    向 user 发送一个 getState 的消息
    user 接收消息
    返回状态给 popup
    popup 收到消息后 改变按钮状态

自动获取商品信息
1 打开插件时获取
2 打开插件时，向 user 发消息，获取 dom 信息 getGoodsInfo
    异步行不通
    改为同步

获取前面两个商品的信息
点击之后填充
时间填充


popup 里增加各种设置参数
