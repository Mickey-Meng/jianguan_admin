import request from '@/utils/request'

// 查询商品库存信息列表
export function listShopGoodsSeed(query) {
  return request({
    url: '/shopGoodsSeed/shopGoodsSeed/list',
    method: 'get',
    params: query
  })
}

// 查询商品库存信息详细
export function getShopGoodsSeed(id) {
  return request({
    url: '/shopGoodsSeed/shopGoodsSeed/' + id,
    method: 'get'
  })
}

// 新增商品库存信息
export function addShopGoodsSeed(data) {
  return request({
    url: '/shopGoodsSeed/shopGoodsSeed',
    method: 'post',
    data: data
  })
}

// 修改商品库存信息
export function updateShopGoodsSeed(data) {
  return request({
    url: '/shopGoodsSeed/shopGoodsSeed',
    method: 'put',
    data: data
  })
}

// 删除商品库存信息
export function delShopGoodsSeed(id) {
  return request({
    url: '/shopGoodsSeed/shopGoodsSeed/' + id,
    method: 'delete'
  })
}
