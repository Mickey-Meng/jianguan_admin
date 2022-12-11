import request from '@/utils/request'

// 查询客户账户信息列表
export function listBasisCustomerAccinfo(query) {
  return request({
    url: '/basisCustomerAccinfo/basisCustomerAccinfo/list',
    method: 'get',
    params: query
  })
}

// 查询客户账户信息详细
export function getBasisCustomerAccinfo(id) {
  return request({
    url: '/basisCustomerAccinfo/basisCustomerAccinfo/' + id,
    method: 'get'
  })
}

// 新增客户账户信息
export function addBasisCustomerAccinfo(data) {
  return request({
    url: '/basisCustomerAccinfo/basisCustomerAccinfo',
    method: 'post',
    data: data
  })
}

// 修改客户账户信息
export function updateBasisCustomerAccinfo(data) {
  return request({
    url: '/basisCustomerAccinfo/basisCustomerAccinfo',
    method: 'put',
    data: data
  })
}

// 删除客户账户信息
export function delBasisCustomerAccinfo(id) {
  return request({
    url: '/basisCustomerAccinfo/basisCustomerAccinfo/' + id,
    method: 'delete'
  })
}
