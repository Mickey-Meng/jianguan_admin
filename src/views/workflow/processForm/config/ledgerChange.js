const fields = [
    {
        'label': '',
        'children': [
            {
                'type': 'input',
                'key': 'bgbh',
                'label': '变更编号',
                'placeholder': '请选择',
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
                'key': 'bgsx',
                'label': '变更事项',
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
                'key': 'bgdj',
                'label': '变更等级',
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
                'key': 'bglx',
                'label': '变更类型',
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
                'key': 'zh',
                'label': '桩号',
                'placeholder': '请输入',
                'rules': [
                    {
                        'required': true,
                        'message': '请输入',
                        'trigger': [ 'blur', 'change' ],
                    }
                ],
                'size': 12,
            },
            {
                'type': 'input',
                'key': 'th',
                'label': '图号',
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
                'key': 'sqrq',
                'label': '申请日期',
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
                'key': 'bgje',
                'label': '变更金额',
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
                'key': 'bgyy',
                'label': '变更原因',
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
                'size': 12,
            },
            {
                'type': 'input',
                'key': 'remark',
                'label': '备注说明',
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