import request from '@/utils/request'

// 查询采购合同与产品关联 列表
export function listContractGoodsRel(query) {
  return request({
    url: '/contractGoodsRel/contractGoodsRel/list',
    method: 'get',
    params: query
  })
}


