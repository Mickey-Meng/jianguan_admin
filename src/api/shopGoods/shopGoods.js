import request from '@/utils/request'

// 查询商品信息列表
export function listShopGoods(query) {
  return request({
    url: '/shopGoods/shopGoods/list',
    method: 'get',
    params: query
  })
}

// 查询商品信息详细
export function getShopGoods(id) {
  return request({
    url: '/shopGoods/shopGoods/' + id,
    method: 'get'
  })
}

// 新增商品信息
export function addShopGoods(data) {
  return request({
    url: '/shopGoods/shopGoods',
    method: 'post',
    data: data
  })
}

// 修改商品信息
export function updateShopGoods(data) {
  return request({
    url: '/shopGoods/shopGoods',
    method: 'put',
    data: data
  })
}

// 删除商品信息
export function delShopGoods(id) {
  return request({
    url: '/shopGoods/shopGoods/' + id,
    method: 'delete'
  })
}
