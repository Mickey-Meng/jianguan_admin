import request from '@/utils/request'

// 查询构建类型列表
export function listComponentType(query) {
  return request({
    url: '/system/jg/componentType/list',
    method: 'get',
    params: query
  })
}

// 查询构建类型详细
export function getComponentType(id) {
  return request({
    url: '/system/jg/componentType/' + id,
    method: 'get'
  })
}

// 新增构建类型
export function addComponentType(data) {
  return request({
    url: '/system/jg/componentType',
    method: 'post',
    data: data
  })
}

// 修改构建类型
export function updateComponentType(data) {
  return request({
    url: '/system/jg/componentType',
    method: 'put',
    data: data
  })
}

// 删除构建类型
export function delComponentType(id) {
  return request({
    url: '/system/jg/componentType/' + id,
    method: 'delete'
  })
}
