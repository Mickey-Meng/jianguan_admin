import request from '@/utils/request'

// 查询地图服务注册列表
export function listMapServerConfig(query) {
  return request({
    url: '/map/mapServerConfig/list',
    method: 'get',
    params: query
  })
}

// 查询地图服务注册详细
export function getMapServerConfig(id) {
  return request({
    url: '/map/mapServerConfig/' + id,
    method: 'get'
  })
}

// 新增地图服务注册
export function addMapServerConfig(data) {
  return request({
    url: '/map/mapServerConfig/add',
    method: 'post',
    data: data
  })
}

// 修改地图服务注册
export function updateMapServerConfig(data) {
  return request({
    url: '/map/mapServerConfig/update',
    method: 'put',
    data: data
  })
}

// 删除地图服务注册
export function delMapServerConfig(id) {
  return request({
    url: '/map/mapServerConfig/delete/' + id,
    method: 'delete'
  })
}

// 地图服务状态修改
export function changeStatusOrVisiable(id, status) {
  return request({
    url: '/map/mapServerConfig/changeStatusOrVisiable',
    method: 'put',
    data: { id, status }
  })
}

