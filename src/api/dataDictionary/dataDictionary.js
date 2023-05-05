import request from '@/utils/request'

// 查询列表
export function listDataDictionary(query) {
  return request({
    url: '/dataDictionary/dataDictionary/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getDataDictionary(id) {
  return request({
    url: '/dataDictionary/dataDictionary/' + id,
    method: 'get'
  })
}

// 新增
export function addDataDictionary(data) {
  return request({
    url: '/dataDictionary/dataDictionary',
    method: 'post',
    data: data
  })
}

// 修改
export function updateDataDictionary(data) {
  return request({
    url: '/dataDictionary/dataDictionary',
    method: 'put',
    data: data
  })
}

// 删除
export function delDataDictionary(id) {
  return request({
    url: '/dataDictionary/dataDictionary/' + id,
    method: 'delete'
  })
}
