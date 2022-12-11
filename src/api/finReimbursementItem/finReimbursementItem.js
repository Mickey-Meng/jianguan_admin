import request from '@/utils/request'

// 查询费用报销明细列表
export function listFinReimbursementItem(query) {
  return request({
    url: '/finReimbursementItem/finReimbursementItem/list',
    method: 'get',
    params: query
  })
}

// 查询费用报销明细详细
export function getFinReimbursementItem(id) {
  return request({
    url: '/finReimbursementItem/finReimbursementItem/' + id,
    method: 'get'
  })
}

// 新增费用报销明细
export function addFinReimbursementItem(data) {
  return request({
    url: '/finReimbursementItem/finReimbursementItem',
    method: 'post',
    data: data
  })
}

// 修改费用报销明细
export function updateFinReimbursementItem(data) {
  return request({
    url: '/finReimbursementItem/finReimbursementItem',
    method: 'put',
    data: data
  })
}

// 删除费用报销明细
export function delFinReimbursementItem(id) {
  return request({
    url: '/finReimbursementItem/finReimbursementItem/' + id,
    method: 'delete'
  })
}
