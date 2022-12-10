const fields = [
    {
        'label': '',
        'children': [
            {
                'type': 'input',
                'key': 'id',
                'label': 'ID',
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
                'key': 'bdbh',
                'label': '标段编号',
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
                'key': 'zmh',
                'label': '子目号',
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
                'key': 'zmmc',
                'label': '子目名称',
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
                'key': 'dw',
                'label': '单位',
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
                'key': 'htdj',
                'label': '合同单价',
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
                'key': 'sjsl',
                'label': '设计数量',
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
                'key': 'fjsl',
                'label': '分解数量',
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
                'key': 'bgsl',
                'label': '变更数量',
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
                'key': 'fhsl',
                'label': '复核数量',
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
                'key': 'yjlsl',
                'label': '已计量数量',
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
                'key': 'fhje',
                'label': '复核金额',
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
                'type': 'dynamic-select',
                'key': 'fjlx',
                'label': '分解类型',
                'placeholder': '请选择',
                'rules': [
                    {
                        'required': true,
                        'message': '请选择登记类型',
                        'trigger': [ 'change' ],
                    },
                ],
                'options': [],
                'size': 12,
            },
            {
                'type': 'radio',
                'key': 'status',
                'label': '状态',
                'options': [
                    {
                        'value': '1',
                        'label': '是'
                    },
                    {
                        'value': '0',
                        'label': '否'
                    },
                ],
                'size': 12,
            },
        ],
    },
];
export default fields;