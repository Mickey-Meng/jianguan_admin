import request from '@/utils/request'

// 查询计量凭证，设计计量、变更计量共用一张凭证，明细分开。列表
export function listMeasurementDocuments(query) {
  return request({
    url: '/measurementDocuments/measurementDocuments/list',
    method: 'get',
    params: query
  })
}

// 查询计量凭证，设计计量、变更计量共用一张凭证，明细分开。详细
export function getMeasurementDocuments(id) {
  return request({
    url: '/measurementDocuments/measurementDocuments/' + id,
    method: 'get'
  })
}

// 新增计量凭证，设计计量、变更计量共用一张凭证，明细分开。
export function addMeasurementDocuments(data) {
  return request({
    url: '/measurementDocuments/measurementDocuments',
    method: 'post',
    data: data
  })
}

// 修改计量凭证，设计计量、变更计量共用一张凭证，明细分开。
export function updateMeasurementDocuments(data) {
  return request({
    url: '/measurementDocuments/measurementDocuments',
    method: 'put',
    data: data
  })
}

// 删除计量凭证，设计计量、变更计量共用一张凭证，明细分开。
export function delMeasurementDocuments(id) {
  return request({
    url: '/measurementDocuments/measurementDocuments/' + id,
    method: 'delete'
  })
}
