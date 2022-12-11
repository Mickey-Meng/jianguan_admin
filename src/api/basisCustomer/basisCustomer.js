import request from '@/utils/request'

// 查询客户资料列表
export function listBasisCustomer(query) {
  return request({
    url: '/basisCustomer/basisCustomer/list',
    method: 'get',
    params: query
  })
}

// 查询客户资料详细
export function getBasisCustomer(id) {
  return request({
    url: '/basisCustomer/basisCustomer/' + id,
    method: 'get'
  })
}

// 新增客户资料
export function addBasisCustomer(data) {
  return request({
    url: '/basisCustomer/basisCustomer',
    method: 'post',
    data: data
  })
}

// 修改客户资料
export function updateBasisCustomer(data) {
  return request({
    url: '/basisCustomer/basisCustomer',
    method: 'put',
    data: data
  })
}

// 删除客户资料
export function delBasisCustomer(id) {
  return request({
    url: '/basisCustomer/basisCustomer/' + id,
    method: 'delete'
  })
}
