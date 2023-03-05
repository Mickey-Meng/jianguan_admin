import request from '@/utils/request'

// 查询台账分解明细列表
export function listLedgerBreakdownLeaf(query) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/getLeaflist',
    method: 'get',
    params: query
  })
}
// 查询台账分解明细列表
export function listLedgerBreakdownDetail(query) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/list',
    method: 'get',
    params: query
  })
}

// 查询台账分解明细列表
export function listLedgerBreakdownTree(query) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/list-info',
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

// 台账分解明细批量保存
export function listLedgerBreakdownAddBatch(data) {
  return request({
    url: '/ledgerDetail/ledgerBreakdownDetail/addBatch',
    method: 'post',
    data: data
  })
}

// 台账分解明细审批
export function listLedgerUpBreakdownDetail(data) {
  // return request({
  //   url: '/ledgerDetail/ledgerBreakdownDetail/upBreakdownDetail',
  //   method: 'post',
  //   data: data
  // })
}
