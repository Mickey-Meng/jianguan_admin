// import { listFinEmp } from "@/api/finEmp/finEmp";
import { listShopGoods } from "@/api/shopGoods/shopGoods";
const fields = [
    {
        'label': '',
        'children': [
            {
                'key': 'contractGoodsRels',
                'type': 'child-form', // 小型表单
                'headerLabel': '商品明细',
                'childrenForm': [
                    {
                        'type': 'auto-complete-input',
                        'key': 'goodsName',
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
                                // supplierName: localStorage.getItem("contractInfoPurchase_supplierName") || ''
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
                                                goodsId: item.id,
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
                        'mainShowKey': 'goodsName',
                        'autoCompleteKeys': [ 'goodsId', 'price' ],
                        onSelect (row) {
                            console.log('onSelect', row);
                        },
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
                        'key': 'goodsNum', // 1
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
                    {
                      'type': 'input',
                      'key': 'goodsId',
                      'style': {'display': "none"},
                      'disableDefault': true,
                    }
                ],
            },
        ],
    },
];
export default fields;
