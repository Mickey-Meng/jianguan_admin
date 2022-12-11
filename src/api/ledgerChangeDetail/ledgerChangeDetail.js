import request from '@/utils/request'

// 查询台账变更/工程变更 明细列表
export function listLedgerChangeDetail(query) {
  return request({
    url: '/ledgerChangeDetail/ledgerChangeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询台账变更/工程变更 明细详细
export function getLedgerChangeDetail(zmh) {
  return request({
    url: '/ledgerChangeDetail/ledgerChangeDetail/' + zmh,
    method: 'get'
  })
}

// 新增台账变更/工程变更 明细
export function addLedgerChangeDetail(data) {
  return request({
    url: '/ledgerChangeDetail/ledgerChangeDetail',
    method: 'post',
    data: data
  })
}

// 新增台账变更/工程变更 明细
export function insertList(data) {
  return request({
    url: '/ledgerChange/ledgerChange/insertList',
    method: 'post',
    data: data
  })
}

// 修改台账变更/工程变更 明细
export function updateLedgerChangeDetail(data) {
  return request({
    url: '/ledgerChangeDetail/ledgerChangeDetail',
    method: 'put',
    data: data
  })
}

// 删除台账变更/工程变更 明细
export function delLedgerChangeDetail(zmh) {
  return request({
    url: '/ledgerChangeDetail/ledgerChangeDetail/' + zmh,
    method: 'delete'
  })
}
