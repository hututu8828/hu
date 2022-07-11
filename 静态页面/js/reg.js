/**
 *  给每个表单项赋值错误消息
 */
const loginId = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return "请输入账号"
    }
    // 验证账号是否存在
    const resp = await API.exists(val)
    // true 表示该账号存在
    if (resp.data) {
        return '该账号已存在，请重新输入'
    }
})

const loginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return "请输入密码"
    }
})

const nickName = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return "请输入昵称"
    }
})

const loginPwdCorfirm = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return "请输入确认密码"
    }
    if (val !== loginPwd.input.value) {
        return '两次密码输入不一致'
    }
})

// 给form 表单注册提交事件
const form = $('.user-form')
form.onsubmit = async function (e) {
    // 阻止表单默认提交事件
    e.preventDefault()
    const result = await FieldValidator.validata(
        loginId,
        loginPwd,
        nickName,
        loginPwdCorfirm
    )
    if (!result) {
        return //不通过直接返回
    }
    const formdata = new FormData(form)
    const data = Object.fromEntries(formdata.entries())
    const resp = await API.reg(data)
    if (resp.code === 0) {
        alert('注册成功，点击确定跳转到首页')
        location.href = 'login.html'
    }

}
