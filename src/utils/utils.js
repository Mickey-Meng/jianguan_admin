export const dealNumberFormat = num => {
    if (num || num === 0) {
        // let numString = num.toString()
        let res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                return $1 + ',';
            });
        })
        return res;
    }
};
export const isEmpty = value => {
    let type = ''
    if (!value || value === '' || value === null) {
        return true
    }
    type = getParamType(value)
    switch (type) {
        case 'string':
            return !value.trim()
        case 'array':
            return value.length === 0
        case 'object':
            return Object.keys(value).length === 0 // 普通对象使用 for...in 判断，有 key 即为 false
        default:
            return false // 其他对象均视作非空
    }
};
export const getParamType = param => {
    let paramType = ''
    paramType = Object.prototype.toString.call(param)
    paramType = paramType.substring(1, paramType.length - 1)
    paramType = paramType.split(' ')
    return paramType[1].toLowerCase()
}