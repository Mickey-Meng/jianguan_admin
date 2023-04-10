import request from '@/utils/request'

// 删除地图方案关联服务注册
export function delPlanServer(ids) {
  return request({
    url: '/map/planServer/delete/' + ids,
    method: 'delete'
  })
}

// 导入地图服务
export function listMapServerConfigByPlanId(queryParams) {
  return request({
    url: '/map/planServer/list/' + queryParams.planId,
    method: 'get',
    data: queryParams
  })
}

// 导入地图服务
export function importMapConfig(data) {
  return request({
    url: '/map/planServer/importMapServerConfig',
    method: 'post',
    data: data
  })
}

