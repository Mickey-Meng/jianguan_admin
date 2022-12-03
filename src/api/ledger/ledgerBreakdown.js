import request from '@/utils/request'

// 查询台账分解列表
export function listLedgerBreakdown(query) {
  return request({
    url: '/ledger/ledgerBreakdown/list',
    method: 'get',
    params: query
  })
}

// 查询台账分解详细
export function getLedgerBreakdown(tzfjbh) {
  return request({
    url: '/ledger/ledgerBreakdown/' + tzfjbh,
    method: 'get'
  })
}

// 新增台账分解
export function addLedgerBreakdown(data) {
  return request({
    url: '/ledger/ledgerBreakdown',
    method: 'post',
    data: data
  })
}

// 修改台账分解
export function updateLedgerBreakdown(data) {
  return request({
    url: '/ledger/ledgerBreakdown',
    method: 'put',
    data: data
  })
}

// 删除台账分解
export function delLedgerBreakdown(tzfjbh) {
  return request({
    url: '/ledger/ledgerBreakdown/' + tzfjbh,
    method: 'delete'
  })
}
