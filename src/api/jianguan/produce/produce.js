import request from '@/utils/request'

// 查询工序信息列表
export function listProduce(query) {
  return request({
    url: '/system/jg/produce/list',
    method: 'get',
    params: query
  })
}

// 查询工序信息详细
export function getProduce(id) {
  return request({
    url: '/system/jg/produce/' + id,
    method: 'get'
  })
}

// 新增工序信息
export function addProduce(data) {
  return request({
    url: '/system/jg/produce',
    method: 'post',
    data: data
  })
}

// 修改工序信息
export function updateProduce(data) {
  return request({
    url: '/system/jg/produce',
    method: 'put',
    data: data
  })
}

// 删除工序信息
export function delProduce(id) {
  return request({
    url: '/system/jg/produce/' + id,
    method: 'delete'
  })
}

export function importProduces(data) {
  console.log("importProduces[/system/jg/produce/importProduces]");
  console.log(data);
  return request({
    url: '/system/jg/produce/importProduces',
    method: 'post',
    data: data
  })
}
