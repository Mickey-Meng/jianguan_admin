import matchMap from './data.js'
import { isEmpty } from '@/utils/utils'

class Validate {
    // 校验金额
    numberValidator (type, allowNull = false) {
        const hash = matchMap.number // 获取校验规则
        return (rule, value, callback) => {
            if (allowNull && value === '') { // 允许为空
                callback()
            } else if (!hash[type].match(value)) {
                return callback(new Error(hash[type].tip))
            }
            callback()
        }
    }

    // 校验利率
    rateValidator (type, allowNull = false) {
        const hash = matchMap.rate // 获取校验规则
        return (rule, value, callback) => {
            if (allowNull && value === '') { // 允许为空
                callback()
            } else if (!hash[type].match(value)) {
                return callback(new Error(hash[type].tip))
            }
            callback()
        }
    }

    // 校验字符串长度，min、max 传了便校验，不传不校验
    checkLength ({
        min,
        max
    }) {
        return (rule, value, callback) => {
            if(isEmpty(value)) {
                return callback()
            }
            if (min && value.length < min) {
                return callback(new Error(`长度不能小于 ${min}`))
            } else if (max && value.length > max) {
                return callback(new Error(`长度不能超过 ${max}`))
            }
            callback()
        }
    }

    //电话号码
    // phonenumber() {
    //      return (rule, value, callback) => {
    //         const match = /^[((d{3,4}-)|d{3.4}-)?d{7,8}]+$/i;
    //         if (!match.test(value)) {
    //             return callback(new Error('请输入正确的电话号码'));
    //         }
    //         callback();
    //     };
    // }
    // 校验数字、字母、特殊符号
    checkSpecial () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9a-zA-Z~\-\\_[\]()|/]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字、字母、特殊符号'))
                }
            }
            callback()
        }
    }

    // 校验数字、字母、中文、特殊符号 【】（）_-空格
    checkSpecial2 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback();
                return;
            }
            const match = /^[0-9a-zA-Z\u4e00-\u9fa5\s-_[\]()【】·（）]+$/i;
            if (!match.test(value)) {
                return callback(new Error('只能输入数字、字母、中文、特殊符号【】（）_-·空格'));
            }
            callback();
        };
    }
    // 校验数字、字母、特殊符号-
    checkSpecial3 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback();
                return;
            }
            const match = /^[0-9a-zA-Z-]+$/i;
            if (!match.test(value)) {
                return callback(new Error('只能输入数字、字母、-'));
            }
            callback();
        };
    }
    // 校验数字
    checkSpecial4 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback();
                return;
            }
            const match = /^[0-9]*$/i;
            if (!match.test(value)) {
                return callback(new Error('只能输入数字'));
            }
            callback();
        };
    }

    // 校验数字、字母、中文、特殊符号 【】（）_-空格·
    checkSpecial5 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback();
                return;
            }
            const match = /^[0-9a-zA-Z\u4e00-\u9fa5\s-_[\]()【】（）·]+$/i;
            if (!match.test(value)) {
                return callback(new Error('只能输入数字、字母、中文、特殊符号【】（）_-·空格'));
            }
            callback();
        };
    }
    // 校验数字、字母、中文
    checkChinese () {
        return (rule, value, callback) => {
            if (value === '') {
                callback();
                return;
            }
            const match = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/i;
            if (!match.test(value)) {
                return callback(new Error('只能输入数字、字母、中文'));
            }
            callback();
        };
    }
    // 校验字母、中文
    checkChinese1 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback();
                return;
            }
            const match = /^[a-zA-Z\u4e00-\u9fa5]+$/i;
            if (!match.test(value)) {
                return callback(new Error('只能输入字母、中文'));
            }
            callback();
        };
    }
    checkNumberAmount () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^\d{1,20}(\.\d{1,2})?$/
                if (!match.test(value)) {
                    return callback(new Error('请输入正确的金额'))
                }
            }
            callback()
        }
    }
    checkNumber () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^\d{1,20}(\.\d{1,2})?$/
                if (!match.test(value)) {
                    return callback(new Error('请输入数字，可输入小数'))
                }
            }
            callback()
        }
    }

    checkNumberFour () {
        return (rule, value, callback) => {
            if (!isEmpty(String(value))) {
                if (String(value).indexOf('.') < 0){
                    if (String(value).length > 17) {
                        return callback(new Error('最多17位整数'));
                    }
                } else {
                    const match = /^\d{1,17}(\.\d{1,6})?$/;
                    if (!match.test(String(value))) {
                        return callback(new Error('最多17位整数,6位小数'));
                    }
                }
            }
            callback();
        };
    }

    checkNumberThree () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^\d{1,17}(\.\d{1,6})?$/
                if (!match.test(value)) {
                    return callback(new Error('请输入正确的金额'))
                }
            }
            callback()
        }
    }

    checkNumberTwo () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^\d{1,3}(\.\d{1,2})?$/
                if (!match.test(value)) {
                    return callback(new Error('请输入正确的金额'))
                }
            }
            callback()
        }
    }

    // 校验数字、字母、中文
    checkChinese () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字、字母、中文'))
                }
            }
            callback()
        }
    }

    // 校验数字、字母
    checkNumberChar () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9a-zA-Z]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字、字母'))
                }
            }
            callback()
        }
    }

    // 校验数字、字母、特殊符号-
    checkSpecial3 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback()
                return
            }
            const match = /^[0-9a-zA-Z-]+$/i
            if (!match.test(value)) {
                return callback(new Error('只能输入数字、字母、-'))
            }
            callback()
        }
    }

    // 校验中文、字母
    checkChineseChar () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[a-zA-Z\u4e00-\u9fa5]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入中文、字母'))
                }
            }
            callback()
        }
    }

    // 校验中文、字母、特殊字符
    checkChineseCharSpecial () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9a-zA-Z\u4e00-\u9fa5~\-\\_[\]()|/]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字、中文、字母、特殊字符'))
                }
            }
            callback()
        }
    }

    // 校验中文、字母、特殊字符
    checkChineseCharSpecialN () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[a-zA-Z\u4e00-\u9fa5~\-\\_[\]()|/]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入中文、字母、特殊字符'))
                }
            }
            callback()
        }
    }

    // 校验持股比例前三后二
    positionsProportion () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                console.log(value, 'value')
                const match = /^(?:0|[1-9]\d{0,2})(\.\d{1,2})?$/
                if (!match.test(value.trim())) {
                    return callback(new Error('只能输入三位以内整数,保留两位小数'))
                }
            }
            callback()
        }
    }

    newPositionsProportion () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                console.log(value, 'value')
                const match = /^(?:0|[1-9]\d{0,2})(\.\d{1,4})?$/
                if (!match.test(value.trim())) {
                    return callback(new Error('只能输入三位以内整数,保留四位小数'))
                }
            }
            callback()
        }
    }

    validate3dot2 = function (rule, value, callback) {
        const reg = /^[\d]{1,3}(\.[\d]{1,2})?$/
        if (!value) {
            callback()
        } else {
            if (reg.test(value.toString().replace(/,/g, ''))) {
                callback()
            } else {
                return callback(new Error('支持小数点前3后2'))
            }
        }
    }
    validate2dot8 = function (rule, value, callback) {
        const reg = /^[\d]{1,2}(\.[\d]{1,8})?$/
        if (!value) {
            callback()
        } else {
            if (reg.test(value.toString().replace(/,/g, ''))) {
                callback()
            } else {
                return callback(new Error('支持小数点前2后8'))
            }
        }
    }
    checkOnlyNumber () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字'))
                }
            }
            callback()
        }
    }

    // 校验数字、字母、中文、特殊符号 【】（）_-空格
    checkSpecial2 () {
        return (rule, value, callback) => {
            if (value === '') {
                callback()
                return
            }
            const match = /^[0-9a-zA-Z\u4e00-\u9fa5\s-_[\]()【】·（）]+$/i
            if (!match.test(value)) {
                return callback(new Error('只能输入数字、字母、中文、特殊符号【】（）_-空格'))
            }
            callback()
        }
    }

    // 校验数字、字母、中文
    checkChineseCharNumber () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字、字母、中文'))
                }
            }
            callback()
        }
    }

    checkEmail () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const flagOne = value.indexOf('@')
                const flagTwo = value.indexOf('.')
                if (!(flagOne >= 0 && flagTwo >= 0)) {
                    return callback(new Error('请输入正确的邮箱'))
                }
            }
            callback()
        }
    }

    checkTel () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9~-]+$/i
                if (!match.test(value)) {
                    return callback(new Error('请输入正确的电话格式'))
                }
            }
            callback()
        }
    }

    checkNumberSpecial () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[0-9~\-\\_[\]()|/]+$/i
                if (!match.test(value)) {
                    return callback(new Error('只能输入数字,特殊字符'))
                }
            }
            callback()
        }
    }

    // 封装表单校验为 promise
    validatePromise (form) {
        return new Promise((resolve, reject) => {
            form.validate(valid => valid ? resolve(valid) : reject(valid))
        })
    }
    CheckSocialCreditCodeNew () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /[A-Z0-9]{18}/g
                if (!match.test(value)) {
                    return callback(new Error('不是有效的统一社会信用编码！'))
                }
            }
            callback()
        }
    }
    CheckCreditCodeNew () {
        return (rule, value, callback) => {
            if (!isEmpty(value)) {
                const match = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
                if (!match.test(value)) {
                    return callback(new Error('不是有效的统一社会信用编码！'))
                }
            }
            callback()
        }
    }
    // 社会统一信用代码
    CheckSocialCreditCode() {
        return (rule, value, callback) => {
            var patrn = /^[0-9A-Z]+$/;
            //18位校验及大写校验
            if ((value.length != 18) || (patrn.test(value) == false)) {
                return callback('不是有效的统一社会信用编码！');
            }
            else {
                var Ancode;//统一社会信用代码的每一个值
                var Ancodevalue;//统一社会信用代码每一个值的权重
                var total = 0;
                var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
                var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
                //不用I、O、S、V、Z
                for (var i = 0; i < value.length - 1; i++) {
                    Ancode = value.substring(i, i + 1);
                    Ancodevalue = str.indexOf(Ancode);
                    total = total + Ancodevalue * weightedfactors[i];
                    //权重与加权因子相乘之和
                }
                var logiccheckcode = 31 - total % 31;
                    if (logiccheckcode == 31) {
                    logiccheckcode = 0;
                }
                var Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y';
                var Array_Str = Str.split(',');
                logiccheckcode = Array_Str[logiccheckcode];
                var checkcode = value.substring(17, 18);
                if (logiccheckcode != checkcode) {
                    return callback('不是有效的统一社会信用编码！');
                } else {
                }
                callback()
            }
        }
    }
    // 校验身份证的
    validateIdCard() {
        return (rule, value, callback) => {
            //15位和18位身份证号码的正则表达式
            var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            //如果通过该验证，说明身份证格式正确，但准确性还需计算
            if (regIdCard.test(value)) {
                if (value.length == 18) {
                    var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                    var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                    var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                    for (var i = 0; i < 17; i++) {
                        idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
                    }
                    var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
                    var idCardLast = value.substring(17);//得到最后一位身份证号码
                    //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                    if (idCardMod == 2) {
                        if (idCardLast == 'X' || idCardLast == 'x') {
                            callback();
                        } else {
                            callback('身份证号码错误！');
                        }
                    } else {
                        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                        if (idCardLast == idCardY[idCardMod]) {
                            callback();
                        } else {
                            callback('身份证号码错误！');
                        }
                    }
                }
            } else {
                callback('身份证格式不正确!');
            }
        }
    }

    checkNumberIsNotZero () {
        return (rule, value, callback) => {
            let reg = /^(0|[1-9][0-9]*)$/
            if (reg.test(value) && Number(value) !== 0) {
                callback()
            } else {
                callback(new Error('请输入正整数并且不能为0'))
            }
            callback();
        };
    }
}

export default new Validate()
