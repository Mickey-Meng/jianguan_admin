import request from '@/utils/request'

// 查询台账分解明细列表
export function listLedgerBreakdownDetail(query) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/list',
    method: 'get',
    params: query
  })
}

// 查询台账分解明细详细
export function getLedgerBreakdownDetail(tzfjbh) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/' + tzfjbh,
    method: 'get'
  })
}

// 新增台账分解明细
export function addLedgerBreakdownDetail(data) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail',
    method: 'post',
    data: data
  })
}

// 修改台账分解明细
export function updateLedgerBreakdownDetail(data) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail',
    method: 'put',
    data: data
  })
}

// 删除台账分解明细
export function delLedgerBreakdownDetail(tzfjbh) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/' + tzfjbh,
    method: 'delete'
  })
}
