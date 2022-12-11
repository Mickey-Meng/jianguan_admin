import request from '@/utils/request'

// 查询员工信息管理列表
export function listFinEmp(query) {
  return request({
    url: '/finEmp/finEmp/list',
    method: 'get',
    params: query
  })
}

// 查询员工信息管理详细
export function getFinEmp(id) {
  return request({
    url: '/finEmp/finEmp/' + id,
    method: 'get'
  })
}

// 新增员工信息管理
export function addFinEmp(data) {
  return request({
    url: '/finEmp/finEmp',
    method: 'post',
    data: data
  })
}

// 修改员工信息管理
export function updateFinEmp(data) {
  return request({
    url: '/finEmp/finEmp',
    method: 'put',
    data: data
  })
}

// 删除员工信息管理
export function delFinEmp(id) {
  return request({
    url: '/finEmp/finEmp/' + id,
    method: 'delete'
  })
}
