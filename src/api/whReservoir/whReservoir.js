import request from '@/utils/request'

// 查询库区设置列表
export function listWhReservoir(query) {
  return request({
    url: '/whReservoir/whReservoir/list',
    method: 'get',
    params: query
  })
}

// 查询库区设置详细
export function getWhReservoir(id) {
  return request({
    url: '/whReservoir/whReservoir/' + id,
    method: 'get'
  })
}

// 新增库区设置
export function addWhReservoir(data) {
  return request({
    url: '/whReservoir/whReservoir',
    method: 'post',
    data: data
  })
}

// 修改库区设置
export function updateWhReservoir(data) {
  return request({
    url: '/whReservoir/whReservoir',
    method: 'put',
    data: data
  })
}

// 删除库区设置
export function delWhReservoir(id) {
  return request({
    url: '/whReservoir/whReservoir/' + id,
    method: 'delete'
  })
}
