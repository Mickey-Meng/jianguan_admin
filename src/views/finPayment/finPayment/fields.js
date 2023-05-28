import {listWarehousing} from "@/api/warehousing/warehousing";
const fields = [
    {
        'label': '',
        'children': [
            {
                'key': 'paymentWarehousingRels',
                'type': 'child-form', // 小型表单
                'headerLabel': '入库明细',
                'childrenForm': [
                    {
                        'type': 'auto-complete-input',
                        'key': 'warehousingCode',
                        'label': '入库单号',
                        'placeholder': '请输入入库单号搜索',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入',
                                'trigger': [ 'blur', 'change' ],
                            },
                        ],
                        querySearchAsync (queryString, cb) {
                            const queryParams = {
                              warehousingCode: queryString,
                              supplierName: localStorage.getItem("finPayment_supplierName") || ''
                            };
                            let flag = false;
                          listWarehousing(queryParams).then(response => {
                                flag = true;
                                if (response.rows.length) {
                                    const d = response.rows.map(item => {
                                        return {
                                            value: item.warehousingCode,
                                            label: item.id,
                                            item: {
                                              contractCode: item.contractCode,
                                              supplierName: item.supplierName,
                                              supplierId: item.supplierId
                                            }
                                        }
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
                        'mainShowKey': 'warehousingCode',
                        'autoCompleteKeys': ['supplierName','contractCode'],
                        onSelect (row) {
                            console.log('onSelect', row);
                        },
                    },
                    {
                        'type': 'input',
                        'key': 'contractCode', // 1
                        'label': '采购合同编码',
                        'disableDefault': true,
                    },
                    {
                        'type': 'input',
                        'key': 'supplierName', // 1
                        'label': '供应商名称',
                        'style': {'display': "none"},
                        'disableDefault': true,
                    },
                    {
                        'type': 'money-input',
                        'key': 'payAmount', // 1
                        'label': '本次付款金额',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入总额',
                                'trigger': [ 'blur', 'change' ],
                            }
                        ],
                        'size': 12
                    },
                    {
                      'type': 'input',
                      'key': 'supplierId',
                      'label': '供应商Id',
                      'placeholder': '',
                      'size': 12,
                      'style': {'display': "none"},
                      'disableDefault': true,
                    },
                ]
            }
        ]
    }
];
export default fields;
