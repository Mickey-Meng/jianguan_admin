import request from '@/utils/request'

// 查询其他款项列表
export function listOtherPayment(query) {
  return request({
    url: '/otherPayment/otherPayment/list',
    method: 'get',
    params: query
  })
}

// 查询其他款项详细
export function getOtherPayment(id) {
  return request({
    url: '/otherPayment/otherPayment/' + id,
    method: 'get'
  })
}

// 新增其他款项
export function addOtherPayment(data) {
  return request({
    url: '/otherPayment/otherPayment',
    method: 'post',
    data: data
  })
}

// 修改其他款项
export function updateOtherPayment(data) {
  return request({
    url: '/otherPayment/otherPayment',
    method: 'put',
    data: data
  })
}

// 删除其他款项
export function delOtherPayment(id) {
  return request({
    url: '/otherPayment/otherPayment/' + id,
    method: 'delete'
  })
}
