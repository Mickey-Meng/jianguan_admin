import request from '@/utils/request'

// 查询供应商付款列表
export function listFinPayment(query) {
  return request({
    url: '/finPayment/finPayment/list',
    method: 'get',
    params: query
  })
}

// 查询供应商付款详细
export function getFinPayment(id) {
  return request({
    url: '/finPayment/finPayment/' + id,
    method: 'get'
  })
}

// 新增供应商付款
export function addFinPayment(data) {
  return request({
    url: '/finPayment/finPayment',
    method: 'post',
    data: data
  })
}

// 修改供应商付款
export function updateFinPayment(data) {
  return request({
    url: '/finPayment/finPayment',
    method: 'put',
    data: data
  })
}

// 删除供应商付款
export function delFinPayment(id) {
  return request({
    url: '/finPayment/finPayment/' + id,
    method: 'delete'
  })
}
