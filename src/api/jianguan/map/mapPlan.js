import request from '@/utils/request'

// 查询地图方案管理列表
export function listMapPlan(query) {
  return request({
    url: '/map/mapPlan/list',
    method: 'get',
    params: query
  })
}

// 查询地图方案管理详细
export function getMapPlan(id) {
  return request({
    url: '/map/mapPlan/' + id,
    method: 'get'
  })
}

// 新增地图方案管理
export function addMapPlan(data) {
  return request({
    url: '/map/plan',
    method: 'post',
    data: data
  })
}

// 修改地图方案管理
export function updateMapPlan(data) {
  return request({
    url: '/map/plan',
    method: 'put',
    data: data
  })
}

// 删除地图方案管理
export function delMapPlan(id) {
  return request({
    url: '/map/mapPlan/' + id,
    method: 'delete'
  })
}

// 查询地图方案下拉树结构
export function getMapPlanTree() {
  return request({
    url: '/map/mapPlan/getMapPlanTree',
    method: 'get'
  })
}
