import request from '@/utils/request'

// 查询仓库设置列表
export function listWhWarehouse(query) {
  return request({
    url: '/whWarehouse/whWarehouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库设置详细
export function getWhWarehouse(id) {
  return request({
    url: '/whWarehouse/whWarehouse/' + id,
    method: 'get'
  })
}

// 新增仓库设置
export function addWhWarehouse(data) {
  return request({
    url: '/whWarehouse/whWarehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库设置
export function updateWhWarehouse(data) {
  return request({
    url: '/whWarehouse/whWarehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库设置
export function delWhWarehouse(id) {
  return request({
    url: '/whWarehouse/whWarehouse/' + id,
    method: 'delete'
  })
}
