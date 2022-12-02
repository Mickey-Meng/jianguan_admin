import request from '@/utils/request'

// 查询测试单列表
export function listTest(query) {
  return request({
    url: '/test/test/list',
    method: 'get',
    params: query
  })
}

// 查询测试单详细
export function getTest(id) {
  return request({
    url: '/test/test/' + id,
    method: 'get'
  })
}

// 新增测试单
export function addTest(data) {
  return request({
    url: '/test/test',
    method: 'post',
    data: data
  })
}

// 修改测试单
export function updateTest(data) {
  return request({
    url: '/test/test',
    method: 'put',
    data: data
  })
}

// 删除测试单
export function delTest(id) {
  return request({
    url: '/test/test/' + id,
    method: 'delete'
  })
}
