// 验证表达项的通用代码

/**
 *  创建一个验证某一个表达项的构造器
 */
class FieldValidator {
    /**
     * 
     * @param {string} loginId  传入一个需要验证的文本框
     * @param {function} validatorFn 验证函数 
     */
    constructor(loginId, validatorFn) {
        // 获取文本框和下面的p元素
        this.input = $('#' + loginId)
        this.p = this.input.nextElementSibling
        this.validatorFn = validatorFn
        //给文本框注册失去焦点事件
        this.input.onblur = () => {
            this.validata()
        }
    }
    /**
     * 开始验证 如果有错误消息就给p元素赋值 返回false 没有错误消息就返回true 给p赋值为空
     */
    async validata() {
        const err = await this.validatorFn(this.input.value)
        if (err) {
            this.p.innerText = err
            return false
        }
        else {
            this.p.innerText = ''
            return true
        }
    }

    // 进行统一验证 如果有一个为false 就返回false 反之就为true
    /**
     *  静态方法  统一验证
     */
    static async validata(...validata) {
        // 把传入进来的实例 每个拿出来验证 因为是异步 所以返回的是一个Promise
        const porms = validata.map(s => s.validata())
        // 把所有promise 聚合
        const date =await Promise.all(porms)
        // 返回每个判断结果 
        return date.every(r => r)
    }
}
