import request from '@/utils/request'

// 查询开工预付款列表
export function listStartupPrepayment(query) {
  return request({
    url: '/startup/startupPrepayment/list',
    method: 'get',
    params: query
  })
}

// 查询开工预付款详细
export function getStartupPrepayment(id) {
  return request({
    url: '/startup/startupPrepayment/' + id,
    method: 'get'
  })
}

// 新增开工预付款
export function addStartupPrepayment(data) {
  return request({
    url: '/startup/startupPrepayment',
    method: 'post',
    data: data
  })
}

// 修改开工预付款
export function updateStartupPrepayment(data) {
  return request({
    url: '/startup/startupPrepayment',
    method: 'put',
    data: data
  })
}

// 删除开工预付款
export function delStartupPrepayment(id) {
  return request({
    url: '/startup/startupPrepayment/' + id,
    method: 'delete'
  })
}
