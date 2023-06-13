import request from '@/utils/request'

// 查询工序库列表
export function listProduceLibrary(query) {
  return request({
    url: '/system/jg/produceLibrary/list',
    method: 'get',
    params: query
  })
}
// 分页查询工序库
export function pageProduceLibrary(query) {
  return request({
    url: '/system/jg/produceLibrary/page',
    method: 'get',
    params: query
  })
}

export function getProduceLibraryTree() {
  return request({
    url: '/system/jg/produceLibrary/getProduceLibraryTree',
    method: 'get'
  })
}
// 查询工序库详细
export function getProduceLibrary(id) {
  return request({
    url: '/system/jg/produceLibrary/' + id,
    method: 'get'
  })
}

// 新增工序库
export function addProduceLibrary(data) {
  return request({
    url: '/system/jg/produceLibrary',
    method: 'post',
    data: data
  })
}

// 修改工序库
export function updateProduceLibrary(data) {
  return request({
    url: '/system/jg/produceLibrary',
    method: 'put',
    data: data
  })
}

// 删除工序库
export function delProduceLibrary(id) {
  return request({
    url: '/system/jg/produceLibrary/' + id,
    method: 'delete'
  })
}

// 复制工序库
export function copyProduceLibrary(data) {
  return request({
    url: '/system/jg/produceLibrary/copy',
    method: 'post',
    data: data
  })
}
