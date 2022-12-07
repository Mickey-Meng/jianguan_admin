import request from '@/utils/request'

// 查询中间计量期数管理列表
export function listMeasurementNo(query) {
  return request({
    url: '/measurementNo/measurementNo/list',
    method: 'get',
    params: query
  })
}

// 查询中间计量期数管理列表
export function listMeasurementListNo() {
  return request({
    url: '/measurementNo/measurementNo/sortList',
    method: 'get'
  })
}

// 查询中间计量期数管理详细
export function getMeasurementNo(id) {
  return request({
    url: '/measurementNo/measurementNo/' + id,
    method: 'get'
  })
}

// 新增中间计量期数管理
export function addMeasurementNo(data) {
  return request({
    url: '/measurementNo/measurementNo',
    method: 'post',
    data: data
  })
}

// 修改中间计量期数管理
export function updateMeasurementNo(data) {
  return request({
    url: '/measurementNo/measurementNo',
    method: 'put',
    data: data
  })
}

// 删除中间计量期数管理
export function delMeasurementNo(id) {
  return request({
    url: '/measurementNo/measurementNo/' + id,
    method: 'delete'
  })
}
