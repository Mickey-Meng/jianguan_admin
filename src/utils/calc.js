import NP from 'number-precision';

const calc = {
    nullList: [ NaN, undefined, null, '' ],

    add (...numberList) {
        return NP.plus(...numberList);
    },

    div (num1, num2) {
        return NP.divide(num1, num2);
    },

    mul (num1, num2) {
        return NP.times(num1, num2);
    },

    // 减法运算
    reduce (...numberList) {
        return NP.minus(...numberList);
    }
};
export default calc;
