import request from '@/utils/request'

// 查询合同条款列表
export function listContractInfo(query) {
  return request({
    url: '/contractInfo/contractInfo/list',
    method: 'get',
    params: query
  })
}

// 查询合同条款详细
export function getContractInfo(id) {
  return request({
    url: '/contractInfo/contractInfo/' + id,
    method: 'get'
  })
}

// 新增合同条款
export function addContractInfo(data) {
  return request({
    url: '/contractInfo/contractInfo',
    method: 'post',
    data: data
  })
}

// 修改合同条款
export function updateContractInfo(data) {
  return request({
    url: '/contractInfo/contractInfo',
    method: 'put',
    data: data
  })
}

// 删除合同条款
export function delContractInfo(id) {
  return request({
    url: '/contractInfo/contractInfo/' + id,
    method: 'delete'
  })
}
