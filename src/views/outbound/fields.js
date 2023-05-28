import {listContractGoodsRel} from "@/api/contractInfoPurchase/contractGoodsRel";
import {Message} from "element-ui";

const fields = [
  {
    'label': '',
    'children': [
      {
        'key': 'warehousingDetails',
        'type': 'child-form', // 小型表单
        'headerLabel': '产品明细',
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
                'trigger': ['blur', 'change'],
              },
            ],
            querySearchAsync(queryString, cb) {
              let contractId = localStorage.getItem("outbound_contractId") || '';
              if(contractId === 'undefined' || contractId === '') {
                Message.info('请先选择销售合同！')
                return;
              }
              const queryParams = {
                goodsName: queryString,
                contractId: contractId
              };
              let flag = false;
              listContractGoodsRel(queryParams).then(response => {
                flag = true;
                if (response.rows.length) {
                  const d = response.rows.map(item => {
                    return {
                      value: item.goodsName,
                      label: item.goodsId,
                      item: {
                        goodsSearchstandard: item.goodsSearchstandard,
                        goodsUnit: item.goodsUnit,
                        goodsId: item.goodsId
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
            'mainShowKey': 'goodsName',
            'autoCompleteKeys': ['goodsSearchstandard', 'goodsUnit', 'goodsId'],
            onSelect(row) {
              console.log('onSelect', row);
            },
          },
          {
            'type': 'input',
            'key': 'goodsSearchstandard', // 1
            'label': '产品规格',
            'required': true,
            'disableDefault': true,
          },
          {
            'type': 'input',
            'key': 'goodsUnit', // 1
            'label': '产品单位',
            'required': true,
            'disableDefault': true,
          },
          {
            'type': 'normal-number',
            'key': 'inventoryNumber', // 1
            'label': '销售数量',
            'rules': [
              {
                'required': true,
                'message': '请输入销售数量',
                'trigger': ['blur', 'change'],
              }
            ],
            'size': 12
          },
          {
            'type': 'money-input',
            'key': 'basePrice', // 1
            'label': '基准价',
            'rules': [
              {
                'required': true,
                'message': '请输入总额',
                'trigger': ['blur', 'change'],
              }
            ],
            'size': 12
          },
          {
            'type': 'money-input',
            'key': 'salePrice', // 1
            'label': '销售价',
            'rules': [
              {
                'required': true,
                'message': '请输入总额',
                'trigger': ['blur', 'change'],
              }
            ],
            'size': 12
          },
          {
            'type': 'money-input',
            'key': 'extraPrice', // 1
            'label': '附加价格',
            'rules': [
              {
                'required': true,
                'message': '请输入总额',
                'trigger': ['blur', 'change'],
              }
            ],
            'size': 12
          },
          {
            'type': 'money-input',
            'key': 'amount',
            'label': '总价',
            'size': 12,
            'disableDefault': true,
            'rules': [
              {
                'required': true,
                'message': '请输入总额',
                'trigger': ['blur', 'change'],
              }
            ],
          },
          {
            'type': 'input',
            'key': 'goodsId',
            'style': {'display': "none"},
          }
        ]
      }
    ]
  }
];
export default fields;
