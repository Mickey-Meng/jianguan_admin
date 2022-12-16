export default {
    // 金额校验规则
    number: {
        '82': {
            match: (value) => { // 小数点前 8 位，小数点后 2 位
                if (/^[1-9][0-9]{1,7}\.[0-9]{1,2}$/i.test(value)) { // 整数位有多位的小数
                    return true;
                } else if (/^[0-9]\.[0-9]{1,2}$/i.test(value)) { // 整数位只有一位的小数
                    return true;
                } else if (/^[0-9]$/i.test(value)) { // 一位整数
                    return true;
                } else if (/^[1-9][0-9]{1,7}$/i.test(value)) { // 多位整数
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-8位，小数位0-2位',
        },
        '26': {
            match: (value) => { // 小数点前 2 位，小数点后 6 位
                if (/^[1-9][0-9]\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                } else if (/^[1-9]?[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '整数位1-2位，小数位0-6位',
        },
        '22': {
            match: (value) => { // 小数点前 2 位，小数点后 2 位
                if (/^[1-9][0-9]\.[0-9]{1,2}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,2}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                } else if (/^[1-9]?[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-2位，小数位0-2位',
        },
        '32': {
            match: (value) => { // 小数点前 3 位，小数点后 2 位
                if (/^[1-9][0-9]{1,2}\.[0-9]{1,2}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,2}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                } else if (/^[1-9]?[0-9]{1,2}$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-3位，小数位0-2位',
        },
        '33': {
            match: (value) => { // 小数点前 3 位，小数点后 3 位
                if (/^[1-9][0-9]{1,2}\.[0-9]{1,3}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,3}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                } else if (/^[1-9]?[0-9]{1,2}$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-3位，小数位0-3位',
        },
        '44': {
            match: (value) => { // 整数 4 位
                if (/^[1-9][0-9]{1,3}\.[0-9]{1,4}$/i.test(value)) {
                    return true;
                }else if (/^[1-9][0-9]{1,3}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入数字，整数1-4位',
        },
        '2': {
            match: (value) => { // 整数 2 位
                console.error('整数', value);
                if (/^[1-9][0-9]$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入数字，整数1-2位',
        },
        '4': {
            match: (value) => { // 整数 4 位
                if (/^[1-9][0-9]{1,3}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入数字，整数1-4位',
        },
        '8': {
            match: (value) => { // 整数 8 位
                if (/^[1-9][0-9]{1,7}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入数字，整数1-8位',
        },
        '14': {
            match: (value) => { // 整数 14 位
                if (/^[1-9][0-9]{1,13}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数1-14位数字',
        },
        '.2': {
            match: (value) => { // 整数至少 1 位，小数 2 位
                if (/^[1-9][0-9]{1,}\.[0-9]{1,2}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,2}$/i.test(value)) {
                    return true;
                } else if (/^[1-9][0-9]{1,}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入数字，整数至少1位，小数点后0-2位',
        },
        '.3': {
            match: (value) => { // 整数至少 1 位，小数 3 位
                if (/^[1-9][0-9]{1,}\.[0-9]{1,3}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,3}$/i.test(value)) {
                    return true;
                } else if (/^[1-9][0-9]{1,}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数至少1位，小数点后0-3位',
        },
        '.4': {
            match: (value) => { // 整数至少 1 位，小数 4 位
                if (/^[1-9][0-9]{1,}\.[0-9]{1,4}$/i.test(value)) {
                    return true;
                } else if (/^[1-9]\.[0-9]{1,4}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,4}$/i.test(value)) {
                    return true;
                } else if (/^[1-9][0-9]{1,}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数至少1位，小数位0-4位',
        },
        '.6': {
            match: (value) => { // 整数至少 1 位，小数 6 位
                if (/^[1-9][0-9]{1,}\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[1-9]\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[1-9][0-9]{1,}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数至少1位，小数点后0-4位',
        },
        'positiveInteger': {
            match: (value) => { // 正整数
                if (/^[1-9][0-9]+$/i.test(value)) { // 两位及以上
                    return true;
                } else if (/^[1-9]$/i.test(value)) { // 一位
                    return true;
                }
                return false;
            },
            tip: '请输入正整数',
        },
        'zeroInteger': {
            match: (value) => { // 包含零的正整数
                if (/^[1-9][0-9]+$/i.test(value)) { // 两位及以上
                    return true;
                } else if (/^[0-9]$/i.test(value)) { // 一位
                    return true;
                }
                return false;
            },
            tip: '请输入包含零在内的正整数',
        },
        'd:d': {
            match: (value) => { // 格式必须是 “数字:数字” 且数字大于 0
                const valueList = value.split(/[:：]/i); // 以 : 分割
                const [ one, two ] = valueList; // 取出前两位数字
                const matchList = [ /^[1-9][0-9]+\.[0-9]+$/i, /^[0-9]\.[0-9]+$/i, /^[0-9]$/i, /^[1-9][0-9]+$/i ]; // 校验小数
                for (let i = 0; i < valueList.length; i++) { // 校验数字格式是否正确
                    let count = 0;
                    for (let j = 0; j < matchList.length; j++) { // 校验
                        if (matchList[j].test(valueList[i])) {
                            count++;
                        }
                    }
                    if (count < 1) { // 一个都匹配不到，不通过
                        return false;
                    }
                }
                if (valueList.length !== 2) { // 校验 数字:数字 格式
                    return false;
                } else if (one && two) { // 校验数字是否大于 0
                    const oneCheck = parseFloat(one) > 0;
                    const twoCheck = parseFloat(two) > 0;
                    return !(!oneCheck || !twoCheck);
                } else if (!one || !two) { // 校验数字是否不存在
                    return false;
                }
                return true;
            },
            tip: '格式必须是 “数字:数字” 且数字大于 0'
        },
        'phone': {
            match: (value) => { // 整数
                if (/^[1-9][0-9]+$/i.test(value)) { // 两位及以上
                    return true;
                } else if (/^[1-9]$/i.test(value)) { // 一位
                    return true;
                }
                return false;
            },
            tip: '请输入数字',
        },
        '14/2': {
            match: (value) => { // 小数点前 14 位，小数点后 2 位
                if (/^[1-9][0-9]{1,13}\.[0-9]{1,2}$/i.test(value)) { // 整数位有多位的小数
                    return true;
                } else if (/^[0-9]\.[0-9]{1,2}$/i.test(value)) { // 整数位只有一位的小数
                    return true;
                } else if (/^[0-9]$/i.test(value)) { // 一位整数
                    return true;
                } else if (/^[1-9][0-9]{1,13}$/i.test(value)) { // 多位整数
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-14位，若有小数只允许最多2位',
        },
        '15/2': {
            match: (value) => { // 小数点前 14 位，小数点后 2 位
                if (/^[1-9][0-9]{1,14}\.[0-9]{1,2}$/i.test(value)) { // 整数位有多位的小数
                    return true;
                } else if (/^[0-9]\.[0-9]{1,2}$/i.test(value)) { // 整数位只有一位的小数
                    return true;
                } else if (/^[0-9]$/i.test(value)) { // 一位整数
                    return true;
                } else if (/^[1-9][0-9]{1,14}$/i.test(value)) { // 多位整数
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-15位，若有小数只允许最多2位',
        },
    },
    rate: {
        '26': {
            match: (value) => { // 小数点前 2 位，小数点后 6 位
                if (/^[1-9][0-9]\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,6}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]$/i.test(value)) {
                    return true;
                } else if (/^[1-9]?[0-9]$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-4位，小数位1-4位',
        },
        '14': { // 利率类型控件校验时用百分比转换成小数点后的值，但是显示上数值是带着%单位的
            match: (value) => { // 小数点前 3 位，小数点后 2 位
                // 固定前1后4
                if (/^[1-9]\.[0-9]{1,4}$/i.test(value)) {
                    return true;
                } else if (/^[0-9]\.[0-9]{1,4}$/i.test(value)) {
                    return true;
                }
                return false;
            },
            tip: '请输入整数位1-3位，小数位0-2位',
        },
    }
};
