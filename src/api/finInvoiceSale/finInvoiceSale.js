import request from '@/utils/request'

// 查询销售开票列表
export function listFinInvoiceSale(query) {
  return request({
    url: '/ql/finInvoiceSale/list',
    method: 'get',
    params: query
  })
}

// 查询销售开票详细
export function getFinInvoiceSale(id) {
  return request({
    url: '/ql/finInvoiceSale/' + id,
    method: 'get'
  })
}

// 新增销售开票
export function addFinInvoiceSale(data) {
  return request({
    url: '/ql/finInvoiceSale',
    method: 'post',
    data: data
  })
}

// 修改销售开票
export function updateFinInvoiceSale(data) {
  return request({
    url: '/ql/finInvoiceSale',
    method: 'put',
    data: data
  })
}

// 删除销售开票
export function delFinInvoiceSale(id) {
  return request({
    url: '/ql/finInvoiceSale/' + id,
    method: 'delete'
  })
}
