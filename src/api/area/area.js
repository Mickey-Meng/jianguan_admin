import request from '@/utils/request'

// 查询省市区列表
export function listArea(query) {
  return request({
    url: '/area/area/list',
    method: 'get',
    params: query
  })
}

// 查询省市区详细
export function getArea(Id) {
  return request({
    url: '/area/area/' + Id,
    method: 'get'
  })
}

// 新增省市区
export function addArea(data) {
  return request({
    url: '/area/area',
    method: 'post',
    data: data
  })
}

// 修改省市区
export function updateArea(data) {
  return request({
    url: '/area/area',
    method: 'put',
    data: data
  })
}

// 删除省市区
export function delArea(Id) {
  return request({
    url: '/area/area/' + Id,
    method: 'delete'
  })
}
