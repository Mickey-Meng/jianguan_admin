import request from '@/utils/request'

// 查询工程量清单列表
export function listContractBill(query) {
  return request({
    url: '/bill/contractBill/list',
    method: 'get',
    params: query
  })
}

// 查询工程量清单列表分页
export function listContractBillPage(query) {
  return request({
    url: '/bill/contractBill/page',
    method: 'get',
    params: query
  })
}

// 查询工程量清单详细
export function getContractBill(id) {
  return request({
    url: '/bill/contractBill/' + id,
    method: 'get'
  })
}

// 新增工程量清单
export function addContractBill(data) {
  return request({
    url: '/bill/contractBill',
    method: 'post',
    data: data
  })
}

// 修改工程量清单
export function updateContractBill(data) {
  return request({
    url: '/bill/contractBill',
    method: 'put',
    data: data
  })
}

// 删除工程量清单
export function delContractBill(id) {
  return request({
    url: '/bill/contractBill/' + id,
    method: 'delete'
  })
}
