// 给所有注册文本框赋值错误消息
const txtLoginId = new FieldValidator('txtLoginId', function (val) {
    if (!val) {
        return '请输入账号'
    }
})

const txtLoginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请输入密码'
    }
})
// 给表单注册提交事件 让表单再进行统一验证
const form = $('.user-form')
form.onsubmit = async function (e) {
    // 阻止表单默认提交事件
    e.preventDefault()
    // 给所有表单进行验证
    const result = await FieldValidator.validata(
        txtLoginId,
        txtLoginPwd,
    )
    // 如果验证不通过直接返回
    if (!result) {
        return
    }
    // 验证通过就调用API里的注册函数
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries())
    const resp = await API.login(data)
    if (resp.code === 0) {
        location.href = 'index.html'
    } else {
        txtLoginId.p.innerText = resp.msg
    }

}
