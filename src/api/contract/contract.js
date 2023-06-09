import request from '@/utils/request'

// 查询合同条款列表
export function listContract(query) {
  return request({
    url: '/contract/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同条款详细
export function getContract(HTBH) {
  return request({
    url: '/contract/contract/' + HTBH,
    method: 'get'
  })
}

// 新增合同条款
export function addContract(data) {
  return request({
    url: '/contract/contract',
    method: 'post',
    data: data
  })
}

// 修改合同条款
export function updateContract(data) {
  return request({
    url: '/contract/contract',
    method: 'put',
    data: data
  })
}

// 删除合同条款
export function delContract(HTBH) {
  return request({
    url: '/contract/contract/' + HTBH,
    method: 'delete'
  })
}
