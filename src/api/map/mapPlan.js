import request from '@/utils/request'

// 查询地图方案管理列表
export function listPlan(query) {
  return request({
    url: '/map/mapPlan/list',
    method: 'get',
    params: query
  })
}

// 查询地图方案管理详细
export function getPlan(id) {
  return request({
    url: '/map/mapPlan/' + id,
    method: 'get'
  })
}

// 新增地图方案管理
export function addPlan(data) {
  return request({
    url: '/map/plan',
    method: 'post',
    data: data
  })
}

// 修改地图方案管理
export function updatePlan(data) {
  return request({
    url: '/map/plan',
    method: 'put',
    data: data
  })
}

// 删除地图方案管理
export function delPlan(id) {
  return request({
    url: '/map/mapPlan/' + id,
    method: 'delete'
  })
}
