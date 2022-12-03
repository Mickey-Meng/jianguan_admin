import request from '@/utils/request'

// 查询台账变更/工程变更列表
export function listLedgerChange(query) {
  return request({
    url: '/ledgerChange/ledgerChange/list',
    method: 'get',
    params: query
  })
}

// 查询台账变更/工程变更详细
export function getLedgerChange(id) {
  return request({
    url: '/ledgerChange/ledgerChange/' + id,
    method: 'get'
  })
}

// 新增台账变更/工程变更
export function addLedgerChange(data) {
  return request({
    url: '/ledgerChange/ledgerChange',
    method: 'post',
    data: data
  })
}

// 修改台账变更/工程变更
export function updateLedgerChange(data) {
  return request({
    url: '/ledgerChange/ledgerChange',
    method: 'put',
    data: data
  })
}

// 删除台账变更/工程变更
export function delLedgerChange(id) {
  return request({
    url: '/ledgerChange/ledgerChange/' + id,
    method: 'delete'
  })
}
