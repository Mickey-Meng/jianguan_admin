import request from '@/utils/request'

// 查询项目信息列表
export function listProjectInfo(query) {
  return request({
    url: '/system/jg/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目信息详细
export function getProjectInfo(id) {
  return request({
    url: '/system/jg/project/' + id,
    method: 'get'
  })
}

// 新增项目信息
export function addProjectInfo(data) {
  return request({
    url: '/system/jg/project',
    method: 'post',
    data: data
  })
}

// 修改项目信息
export function updateProjectInfo(data) {
  return request({
    url: '/system/jg/project',
    method: 'put',
    data: data
  })
}

// 删除项目信息
export function delProjectInfo(id) {
  return request({
    url: '/system/jg/project/' + id,
    method: 'delete'
  })
}

// 查询项目机构树
export function getProjectTree() {
  return request({
    url: '/system/jg/project/getProjectTree',
    method: 'get'
  })
}

