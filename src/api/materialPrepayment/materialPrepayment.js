import request from '@/utils/request'

// 查询材料预付款列表
export function listMaterialPrepayment(query) {
  return request({
    url: '/materialPrepayment/materialPrepayment/list',
    method: 'get',
    params: query
  })
}

// 查询材料预付款详细
export function getMaterialPrepayment(id) {
  return request({
    url: '/materialPrepayment/materialPrepayment/' + id,
    method: 'get'
  })
}

// 新增材料预付款
export function addMaterialPrepayment(data) {
  return request({
    url: '/materialPrepayment/materialPrepayment',
    method: 'post',
    data: data
  })
}

// 修改材料预付款
export function updateMaterialPrepayment(data) {
  return request({
    url: '/materialPrepayment/materialPrepayment',
    method: 'put',
    data: data
  })
}

// 删除材料预付款
export function delMaterialPrepayment(id) {
  return request({
    url: '/materialPrepayment/materialPrepayment/' + id,
    method: 'delete'
  })
}
