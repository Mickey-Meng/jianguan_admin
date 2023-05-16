import request from '@/utils/request'

// 查询公司信息列表
export function listCompany(query) {
  return request({
    url: '/system/jg/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司信息详细
export function getCompany(id) {
  return request({
    url: '/system/jg/company/' + id,
    method: 'get'
  })
}

// 新增公司信息
export function addCompany(data) {
  return request({
    url: '/system/jg/company',
    method: 'post',
    data: data
  })
}

// 修改公司信息
export function updateCompany(data) {
  return request({
    url: '/system/jg/company',
    method: 'put',
    data: data
  })
}

// 删除公司信息
export function delCompany(id) {
  return request({
    url: '/system/jg/company/' + id,
    method: 'delete'
  })
}
