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
    url: '/map/mapServerConfig',
    method: 'post',
    data: data
  })
}

// 修改地图服务注册
export function updateMapServerConfig(data) {
  return request({
    url: '/map/mapServerConfig',
    method: 'put',
    data: data
  })
}

// 删除地图服务注册
export function delMapServerConfig(id) {
  return request({
    url: '/map/mapServerConfig/' + id,
    method: 'delete'
  })
}

// 用户状态修改
export function changeServerStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/map/mapServerConfig/changeStatus',
    method: 'put',
    data: data
  })
}

export function importMapConfig(mapServerIds) {
  return request({
    url: '/map/mapServerConfig/importMapConfig',
    method: 'put',
    data: data
  })
}

