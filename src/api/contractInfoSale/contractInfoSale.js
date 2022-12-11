import request from '@/utils/request'

// 查询合同管理列表
export function listContractInfoSale(query) {
  return request({
    url: '/contractInfoSale/contractInfoSale/list',
    method: 'get',
    params: query
  })
}

// 查询合同管理详细
export function getContractInfoSale(id) {
  return request({
    url: '/contractInfoSale/contractInfoSale/' + id,
    method: 'get'
  })
}

// 新增合同管理
export function addContractInfoSale(data) {
  return request({
    url: '/contractInfoSale/contractInfoSale',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContractInfoSale(data) {
  return request({
    url: '/contractInfoSale/contractInfoSale',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContractInfoSale(id) {
  return request({
    url: '/contractInfoSale/contractInfoSale/' + id,
    method: 'delete'
  })
}
