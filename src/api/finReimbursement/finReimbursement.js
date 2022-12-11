import request from '@/utils/request'

// 查询费用报销列表
export function listFinReimbursement(query) {
  return request({
    url: '/finReimbursement/finReimbursement/list',
    method: 'get',
    params: query
  })
}

// 查询费用报销详细
export function getFinReimbursement(id) {
  return request({
    url: '/finReimbursement/finReimbursement/' + id,
    method: 'get'
  })
}

// 新增费用报销
export function addFinReimbursement(data) {
  return request({
    url: '/finReimbursement/finReimbursement',
    method: 'post',
    data: data
  })
}

// 修改费用报销
export function updateFinReimbursement(data) {
  return request({
    url: '/finReimbursement/finReimbursement',
    method: 'put',
    data: data
  })
}

// 删除费用报销
export function delFinReimbursement(id) {
  return request({
    url: '/finReimbursement/finReimbursement/' + id,
    method: 'delete'
  })
}
