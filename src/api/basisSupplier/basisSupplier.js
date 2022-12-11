import request from '@/utils/request'

// 查询供应商管理列表
export function listBasisSupplier(query) {
  return request({
    url: '/basisSupplier/basisSupplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商管理详细
export function getBasisSupplier(id) {
  return request({
    url: '/basisSupplier/basisSupplier/' + id,
    method: 'get'
  })
}

// 新增供应商管理
export function addBasisSupplier(data) {
  return request({
    url: '/basisSupplier/basisSupplier',
    method: 'post',
    data: data
  })
}

// 修改供应商管理
export function updateBasisSupplier(data) {
  return request({
    url: '/basisSupplier/basisSupplier',
    method: 'put',
    data: data
  })
}

// 删除供应商管理
export function delBasisSupplier(id) {
  return request({
    url: '/basisSupplier/basisSupplier/' + id,
    method: 'delete'
  })
}
