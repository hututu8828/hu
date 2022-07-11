var API = (function () {
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'

    // 接口请求封装
    function get(url) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + url, { headers })
    }
    function post(url, bodyObj) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + url, {
            headers,
            method: 'POST',
            body: JSON.stringify(bodyObj)
        })
    }
    /**
     *  注册接口
     * @param {*} userInfo     账号 密码 昵称
     */
    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo)
        return await resp.json()
    }
    /**
     *  登录接口
     * @param {*} loginInfo     账号密码
     */
    async function login(loginInfo) {
        const resp = await fetch(BASE_URL + '/api/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginInfo)
        })
        const result = await resp.json()
        // code ===0 代表登录成功 成功就把登录令牌保存在浏览器里
        if (result.code === 0) {
            const token = resp.headers.get('authorization')
            localStorage.setItem(TOKEN_KEY, token)
        }
        return result
    }
    /**
     *  验证账号接口
     * @param {*} loginId  账号密码
     */
    async function exists(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId)
        return await resp.json()
    }
    /**
     * 验证账号接口
     * 当前登录的账号信息
     */
    async function profile() {
        const resp = await get('/api/user/profile')
        return await resp.json()
    }
    /**
     *  发送聊天消息
     * @param {*} content  
     */
    async function sendChat(content) {
        const resp = await post('/api/chat', { content })
        return await resp.json()
    }
    /**
     * 获取聊天记录接口
     */
    async function getHistory() {
        const resp = await get('/api/chat/history')
        return await resp.json()
    }
    function logginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }
    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        logginOut
    }
})()
