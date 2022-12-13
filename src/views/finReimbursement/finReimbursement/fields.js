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
                        'type': 'dynamic-select-normal',
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
                        'dicKey': '',
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