import request from '@/utils/request'

// 查询台账报审列表
export function listLedgerApproval(query) {
  return request({
    url: '/ledgerapproval/ledgerApproval/listMeaLedgerApprovalVo',
    method: 'get',
    params: query
  })
}

// 查询台账报审详细
export function getLedgerApproval(id) {
  return request({
    url: '/ledgerapproval/ledgerApproval/' + id,
    method: 'get'
  })
}

// 新增台账报审
export function addLedgerApproval(data) {
  return request({
    url: '/ledgerapproval/ledgerApproval',
    method: 'post',
    data: data
  })
}

// 修改台账报审
export function updateLedgerApproval(data) {
  return request({
    url: '/ledgerapproval/ledgerApproval',
    method: 'put',
    data: data
  })
}

// 删除台账报审
export function delLedgerApproval(id) {
  return request({
    url: '/ledgerapproval/ledgerApproval/' + id,
    method: 'delete'
  })
}

// 查询台账报审上报
export function ledgerApprovalUp(data) {
  return request({
    url: '/ledgerapproval/ledgerApproval/up',
    method: 'post',
    data: data
  })
}