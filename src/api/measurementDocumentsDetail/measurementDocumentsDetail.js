import request from '@/utils/request'

// 查询台账变更/工程变更 明细列表
export function listMeasurementDocumentsDetail(query) {
  return request({
    url: '/measurementDocumentsDetail/measurementDocumentsDetail/list',
    method: 'get',
    params: query
  })
}

// 查询台账变更/工程变更 明细详细
export function getMeasurementDocumentsDetail(id) {
  return request({
    url: '/measurementDocumentsDetail/measurementDocumentsDetail/' + id,
    method: 'get'
  })
}

// 新增台账变更/工程变更 明细
export function addMeasurementDocumentsDetail(data) {
  return request({
    url: '/measurementDocumentsDetail/measurementDocumentsDetail',
    method: 'post',
    data: data
  })
}

// 修改台账变更/工程变更 明细
export function updateMeasurementDocumentsDetail(data) {
  return request({
    url: '/measurementDocumentsDetail/measurementDocumentsDetail',
    method: 'put',
    data: data
  })
}

// 删除台账变更/工程变更 明细
export function delMeasurementDocumentsDetail(id) {
  return request({
    url: '/measurementDocumentsDetail/measurementDocumentsDetail/' + id,
    method: 'delete'
  })
}
