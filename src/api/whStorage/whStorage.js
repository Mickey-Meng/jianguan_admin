import request from '@/utils/request'

// 查询库位(储位)设置列表
export function listWhStorage(query) {
  return request({
    url: '/whStorage/whStorage/list',
    method: 'get',
    params: query
  })
}

// 查询库位(储位)设置详细
export function getWhStorage(id) {
  return request({
    url: '/whStorage/whStorage/' + id,
    method: 'get'
  })
}

// 新增库位(储位)设置
export function addWhStorage(data) {
  return request({
    url: '/whStorage/whStorage',
    method: 'post',
    data: data
  })
}

// 修改库位(储位)设置
export function updateWhStorage(data) {
  return request({
    url: '/whStorage/whStorage',
    method: 'put',
    data: data
  })
}

// 删除库位(储位)设置
export function delWhStorage(id) {
  return request({
    url: '/whStorage/whStorage/' + id,
    method: 'delete'
  })
}
