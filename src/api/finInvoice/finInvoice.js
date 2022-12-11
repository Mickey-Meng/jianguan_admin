import request from '@/utils/request'

// 查询供应商开票列表
export function listFinInvoice(query) {
  return request({
    url: '/finInvoice/finInvoice/list',
    method: 'get',
    params: query
  })
}

// 查询供应商开票详细
export function getFinInvoice(id) {
  return request({
    url: '/finInvoice/finInvoice/' + id,
    method: 'get'
  })
}

// 新增供应商开票
export function addFinInvoice(data) {
  return request({
    url: '/finInvoice/finInvoice',
    method: 'post',
    data: data
  })
}

// 修改供应商开票
export function updateFinInvoice(data) {
  return request({
    url: '/finInvoice/finInvoice',
    method: 'put',
    data: data
  })
}

// 删除供应商开票
export function delFinInvoice(id) {
  return request({
    url: '/finInvoice/finInvoice/' + id,
    method: 'delete'
  })
}
