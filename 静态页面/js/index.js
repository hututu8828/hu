(async function () {
    // 验证登录状态 登录就显示登录信息 未登录就跳转到首页
    const resp = await API.profile()
    const data = resp.data
    // 如果没有登录就跳转到登录页 直接返回
    if (!data) {
        alert(resp.msg)
        location.href = 'login.html'
        return
    }
    // 获取页面需要操作的所有dom对象
    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        form: $('.msg-container')
    }
    // 以下情况为已登录情况

    //正确显示账号和昵称
    userInfo()
    function userInfo() {
        doms.aside.loginId.innerText = data.loginId;
        doms.aside.nickname.innerText = data.nickname
    }
    // 点击关闭聊天窗口 等于注销登录
    doms.close.onclick = function () {
        location.href = 'login.html'
        API.logginOut()
    }

    // 根据聊天消息对象创建html元素
    function addChat(userInfo) {

        const chatItem = $$$('div')
        chatItem.classList.add('chat-item')
        if (userInfo.from) {
            chatItem.classList.add('me')
        }

        const img = $$$('img')
        img.classList.add('chat-avatar')
        img.src = userInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg'

        const chatContent = $$$('div')
        chatContent.classList.add('chat-content')
        chatContent.innerText = userInfo.content

        const chatDate = $$$('div')
        chatDate.classList.add('chat-date')
        chatDate.innerText = time(userInfo.createdAt)

        chatItem.appendChild(img)
        chatItem.appendChild(chatContent)
        chatItem.appendChild(chatDate)
        doms.chatContainer.appendChild(chatItem)
    }

    // 格式化时间 0000-00-00 00:00:00
    function time(time) {
        const date = new Date(time)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return (`${year}-${month}-${day} ${hours}:${min}:${seconds}`)
    }

    // 获取历史聊天记录
    await loadHistory()
    async function loadHistory() {
        const resp = await API.getHistory()
        for (const item of resp.data) {
            addChat(item)
        }
        // 设置滚动条在最底部
        scroll()
    }
    // 设置滚动条在最底部
    function scroll() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
    }
    //发送聊天消息
    async function sendChat() {
        const content = doms.txtMsg.value.trim()
        if (!content) {
            return;
        }
        addChat({
            from: data.loginId,
            to: null,
            createdAt: Date.now(),
            content
        })
        scroll()
        doms.txtMsg.value = ''
        const resp = await API.sendChat(content)
        addChat({
            from: null,
            to:data.loginId,
            ...resp.data
        })
        scroll()
    }
    doms.form.onsubmit = function (e) {
        e.preventDefault()
        sendChat()
    }
})()