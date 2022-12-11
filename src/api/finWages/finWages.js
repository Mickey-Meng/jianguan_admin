import request from '@/utils/request'

// 查询工资管理列表
export function listFinWages(query) {
  return request({
    url: '/finWages/finWages/list',
    method: 'get',
    params: query
  })
}

// 查询工资管理详细
export function getFinWages(id) {
  return request({
    url: '/finWages/finWages/' + id,
    method: 'get'
  })
}

// 新增工资管理
export function addFinWages(data) {
  return request({
    url: '/finWages/finWages',
    method: 'post',
    data: data
  })
}

// 修改工资管理
export function updateFinWages(data) {
  return request({
    url: '/finWages/finWages',
    method: 'put',
    data: data
  })
}

// 删除工资管理
export function delFinWages(id) {
  return request({
    url: '/finWages/finWages/' + id,
    method: 'delete'
  })
}
