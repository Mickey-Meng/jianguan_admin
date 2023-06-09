import request from '@/utils/request'

// 查询入库管理列表
export function listWarehousing(query) {
  return request({
    url: '/warehousing/warehousing/list',
    method: 'get',
    params: query
  })
}

// 查询入库管理详细
export function getWarehousing(id) {
  return request({
    url: '/warehousing/warehousing/' + id,
    method: 'get'
  })
}

// 新增入库管理
export function addWarehousing(data) {
  return request({
    url: '/warehousing/warehousing',
    method: 'post',
    data: data
  })
}

// 修改入库管理
export function updateWarehousing(data) {
  return request({
    url: '/warehousing/warehousing',
    method: 'put',
    data: data
  })
}

// 删除入库管理
export function delWarehousing(id) {
  return request({
    url: '/warehousing/warehousing/' + id,
    method: 'delete'
  })
}
