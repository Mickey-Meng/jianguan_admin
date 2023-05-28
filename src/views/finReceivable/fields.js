import {listOutbound} from "@/api/outbound/outbound";
const fields = [
    {
        'label': '',
        'children': [
            {
                'key': 'receivableOutboundRels',
                'type': 'child-form', // 小型表单
                'headerLabel': '出库明细',
                'childrenForm': [
                    {
                        'type': 'auto-complete-input',
                        'key': 'outboundCode',
                        'label': '出库单号',
                        'placeholder': '请输入出库单号搜索',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入',
                                'trigger': [ 'blur', 'change' ],
                            },
                        ],
                        querySearchAsync (queryString, cb) {
                            let flag = false;
                          const queryParams = {
                            outboundCode: queryString,
                            customerName: localStorage.getItem("finReceivable_customerName") || ''
                          };
                          listOutbound(queryParams).then(response => {
                                flag = true;
                                if (response.rows.length) {
                                    const d = response.rows.map(item => {
                                        return {
                                            value: item.outboundCode,
                                            label: item.id,
                                            item: {
                                              saleContractCode: item.saleContractCode,
                                              customerName: item.customerName
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
                        'mainShowKey': 'outboundCode',
                        'autoCompleteKeys': ['customerName','saleContractCode'],
                        onSelect (row) {
                            console.log('onSelect', row);
                        },
                    },
                    {
                        'type': 'input',
                        'key': 'saleContractCode', // 1
                        'label': '销售合同编码',
                        'disableDefault': true,
                    },
                    {
                        'type': 'input',
                        'key': 'customerName', // 1
                        'style': {'display': "none"},
                        'label': '客户名称',
                        'disableDefault': true,
                    },
                    {
                        'type': 'money-input',
                        'key': 'amount', // 1
                        'label': '本次收款金额',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入总额',
                                'trigger': [ 'blur', 'change' ],
                            }
                        ],
                        'size': 12
                    }
                ]
            }
        ]
    }
];
export default fields;
