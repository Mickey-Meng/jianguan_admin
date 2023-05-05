import request from '@/utils/request'

// 查询收款记录列表
export function listFinReceivable(query) {
  return request({
    url: '/ql/finReceivable/list',
    method: 'get',
    params: query
  })
}

// 查询收款记录详细
export function getFinReceivable(id) {
  return request({
    url: '/ql/finReceivable/' + id,
    method: 'get'
  })
}

// 新增收款记录
export function addFinReceivable(data) {
  return request({
    url: '/ql/finReceivable',
    method: 'post',
    data: data
  })
}

// 修改收款记录
export function updateFinReceivable(data) {
  return request({
    url: '/ql/finReceivable',
    method: 'put',
    data: data
  })
}

// 删除收款记录
export function delFinReceivable(id) {
  return request({
    url: '/ql/finReceivable/' + id,
    method: 'delete'
  })
}
