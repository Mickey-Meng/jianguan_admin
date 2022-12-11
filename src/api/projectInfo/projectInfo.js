import request from '@/utils/request'

// 查询项目信息列表
export function listProjectInfo(query) {
  return request({
    url: '/projectInfo/projectInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目信息详细
export function getProjectInfo(id) {
  return request({
    url: '/projectInfo/projectInfo/' + id,
    method: 'get'
  })
}

// 新增项目信息
export function addProjectInfo(data) {
  return request({
    url: '/projectInfo/projectInfo',
    method: 'post',
    data: data
  })
}

// 修改项目信息
export function updateProjectInfo(data) {
  return request({
    url: '/projectInfo/projectInfo',
    method: 'put',
    data: data
  })
}

// 删除项目信息
export function delProjectInfo(id) {
  return request({
    url: '/projectInfo/projectInfo/' + id,
    method: 'delete'
  })
}
