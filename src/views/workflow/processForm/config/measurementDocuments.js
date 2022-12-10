const fields = [
    {
        'label': '',
        'children': [
            {
                'type': 'input',
                'key': 'pzbh',
                'label': '凭证编号',
                'placeholder': '请输入',
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
                'key': 'jgzs',
                'label': '交工证书',
                'placeholder': '请输入',
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
                'key': 'gcbw',
                'label': '工程部位',
                'placeholder': '请输入',
                'rules': [
                    {
                        'required': true,
                        'message': '请输入',
                        'trigger': [ 'blur', 'change' ],
                    },
                ],
                'size': 24,
            },
            {
                'type': 'textarea',
                'key': 'jss',
                'label': '计算式',
                'placeholder': '请输入',
                'rules': [
                    {
                        'required': true,
                        'message': '请输入',
                        'trigger': [ 'blur', 'change' ],
                    },
                ],
                'size': 24,
            },
            {
                'type': 'slot',
                'label': '附件地址',
                'name': 'file',
                'size': 24,
            },
            {
                'type': 'slot',
                'label': '',
                'name': 'table',
                'size': 24,
            },
        ],
    },
];
export default fields;