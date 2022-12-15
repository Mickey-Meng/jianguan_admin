import { listFinEmp } from "@/api/finEmp/finEmp";
const fields = [
    {
        'label': '',
        'children': [
            {
                'type': 'auto-complete-input',
                'key': 'empName',
                'label': '员工姓名',
                'placeholder': '请输入员工姓名搜索',
                'rules': [
                    {
                        'required': true,
                        'message': '请输入',
                        'trigger': [ 'blur', 'change' ],
                    },
                ],
                'size': 12,
                querySearchAsync (queryString, cb, formItem) {
                    console.log(`你的请求字符串是 ${queryString}`);
                    console.log('该组件元素是', formItem);
                    console.log('该组件回调', cb);
                    const queryParams = {
                        empName: queryString,
                    };
                    let flag = false;
                    listFinEmp(queryParams).then(response => {
                        flag = true;
                        if (response.rows.length) {
                            const d = response.rows.map(item => {
                                return {
                                    value: item.empName,
                                    label: item.empId,
                                    item
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
                'mainShowKey': 'empName',
                'autoCompleteKeys': [ 'empId' ],
            },
            {
                'type': 'input',
                'key': 'empId',
                'label': '员工id',
                'placeholder': '',
                'size': 12,
                'disableDefault': true,
            },
            {
                'type': 'date-input',
                'key': 'finReimbursementDate',
                'label': '报销日期',
                'placeholder': '请选择报销日期',
                'rules': [
                    {
                        'required': true,
                        'message': '请输入',
                        'trigger': [ 'blur', 'change' ],
                    },
                ],
                'size': 12,
            },
            {
                'type': 'money-input',
                'key': 'finAmount',
                'label': '金额',
                'placeholder': '请输入金额',
                'rules': [
                    {
                        'required': true,
                        'message': '请输入',
                        'trigger': [ 'blur', 'change' ],
                    },
                ],
                'size': 12,
                'disableDefault': true,
            },
            {
                'type': 'textarea',
                'key': 'remark',
                'label': '备注说明',
                'placeholder': '',
                'size': 12,
                'autosize': {
                    'minRows': 2,
                    'maxRows': 4
                },
            },
            {
                'key': 'bxmx',
                'type': 'child-form', // 小型表单
                'headerLabel': '报销明细',
                'childrenForm': [
                    {
                        'type': 'normal-select',
                        'key': 'bxlt', // 1
                        'label': '报销类型',
                        'placeholder': '请选择',
                        'rules': [
                            {
                                'required': true,
                                'message': '请选择报销类型',
                                'trigger': [ 'change' ],
                            },
                        ],
                        'options': [],
                        'dicKey': 'fin_reimbursement_type',
                        'size': 12,
                    },
                    {
                        'type': 'money-input',
                        'key': 'bxje', // 1
                        'label': '报销金额',
                        'rules': [
                            {
                                'required': true,
                                'message': '请输入报销金额',
                                'trigger': [ 'blur', 'change' ],
                            }
                        ],
                        'size': 12,
                    },
                ],
            },
        ],
    },
];
export default fields;