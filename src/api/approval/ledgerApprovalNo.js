import request from '@/utils/request'

// 查询期数管理列表
export function listLedgerApprovalNo(query) {
  return request({
    url: '/approval/ledgerApprovalNo/list',
    method: 'get',
    params: query
  })
}

// 查询期数管理详细
export function getLedgerApprovalNo(id) {
  return request({
    url: '/approval/ledgerApprovalNo/' + id,
    method: 'get'
  })
}

// 新增期数管理
export function addLedgerApprovalNo(data) {
  return request({
    url: '/approval/ledgerApprovalNo',
    method: 'post',
    data: data
  })
}

// 修改期数管理
export function updateLedgerApprovalNo(data) {
  return request({
    url: '/approval/ledgerApprovalNo',
    method: 'put',
    data: data
  })
}

// 删除期数管理
export function delLedgerApprovalNo(id) {
  return request({
    url: '/approval/ledgerApprovalNo/' + id,
    method: 'delete'
  })
}
// 查询期数管理详细
export function getMaxInfo() {
  return request({
    url: '/approval/ledgerApprovalNo/getMaxInfo',
    method: 'get'
  })
}
