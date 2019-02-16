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
        }
})
