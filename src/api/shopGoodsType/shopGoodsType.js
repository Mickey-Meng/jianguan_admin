import request from '@/utils/request'

// 查询商品类别列表
export function listShopGoodsType(query) {
  return request({
    url: '/shopGoodsType/shopGoodsType/list',
    method: 'get',
    params: query
  })
}

// 查询商品类别详细
export function getShopGoodsType(id) {
  return request({
    url: '/shopGoodsType/shopGoodsType/' + id,
    method: 'get'
  })
}

// 新增商品类别
export function addShopGoodsType(data) {
  return request({
    url: '/shopGoodsType/shopGoodsType',
    method: 'post',
    data: data
  })
}

// 修改商品类别
export function updateShopGoodsType(data) {
  return request({
    url: '/shopGoodsType/shopGoodsType',
    method: 'put',
    data: data
  })
}

// 删除商品类别
export function delShopGoodsType(id) {
  return request({
    url: '/shopGoodsType/shopGoodsType/' + id,
    method: 'delete'
  })
}
