import request from '@/utils/request'

// 查询采购合同 列表
export function listContractInfoPurchase(query) {
  return request({
    url: '/contractInfoPurchase/contractInfoPurchase/list',
    method: 'get',
    params: query
  })
}

// 查询采购合同 详细
export function getContractInfoPurchase(id) {
  return request({
    url: '/contractInfoPurchase/contractInfoPurchase/' + id,
    method: 'get'
  })
}

// 新增采购合同 
export function addContractInfoPurchase(data) {
  return request({
    url: '/contractInfoPurchase/contractInfoPurchase',
    method: 'post',
    data: data
  })
}

// 修改采购合同 
export function updateContractInfoPurchase(data) {
  return request({
    url: '/contractInfoPurchase/contractInfoPurchase',
    method: 'put',
    data: data
  })
}

// 删除采购合同 
export function delContractInfoPurchase(id) {
  return request({
    url: '/contractInfoPurchase/contractInfoPurchase/' + id,
    method: 'delete'
  })
}
