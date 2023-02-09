// import { listFinEmp } from "@/api/finEmp/finEmp";
import { listShopGoods } from "@/api/shopGoods/shopGoods";
const fields = [
    {
        'label': '',
        'children': [
            {
                'key': 'qlWarehousingBos',
                'type': 'child-form', // 小型表单
                'headerLabel': '商品明细',
                'childrenForm': [
                    {
                        'type': 'auto-complete-input',
                        'key': 'proudctName',
                        'label': '产品名称',
                        'placeholder': '请输入产品名称搜索',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入',
                                'trigger': [ 'blur', 'change' ],
                            },
                        ],
                        'size': 12,
                        querySearchAsync (queryString, cb, formItem) {
                            const queryParams = {
                                productName: queryString,
                            };
                            let flag = false;
                            listShopGoods(queryParams).then(response => {
                                flag = true;
                                if (response.rows.length) {
                                    const d = response.rows.map(item => {
                                        return {
                                            value: item.goodsName,
                                            label: item.id,
                                            item: {
                                                proudctId: item.id,
                                                price: item.costPrice
                                            }
                                        };
                                    });
                                    cb(d);
                                } else {
                                    cb([]);
                                }
                            }).finally(() => {
                                if (!flag) {
                                    cb([]);
                                }
                            });
                        },
                        'mainShowKey': 'proudctName',
                        'autoCompleteKeys': [ 'proudctId', 'price' ],
                        onSelect (row) {
                            console.log('onSelect', row);
                        },
                    },
                    {
                        'type': 'input',
                        'key': 'proudctId',
                        'label': '产品id',
                        'placeholder': '',
                        'size': 12,
                        'disableDefault': true,
                    },
                    {
                        'type': 'money-input',
                        'key': 'price', // 1
                        'label': '单价',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入单价',
                                'trigger': [ 'blur', 'change' ],
                            }
                        ],
                        'size': 12,
                    },
                    {
                        'type': 'number-input',
                        'key': 'orderNumber', // 1
                        'label': '数量',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入数量',
                                'trigger': [ 'blur', 'change' ],
                            }
                        ],
                        'size': 12,
                    },
                    {
                        'type': 'money-input',
                        'key': 'amount', // 1
                        'label': '总额',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入总额',
                                'trigger': [ 'blur', 'change' ],
                            }
                        ],
                        'size': 12,
                        'disableDefault': true,
                    },
                ],
            },
        ],
    },
];
export default fields;