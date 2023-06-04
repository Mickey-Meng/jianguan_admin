import request from '@/utils/request'

// 查询项目名称和logo
export function getLogoAndTitle(id) {
  return request({
    url: '/logo/'+id,
    method: 'get'
  })
}
export function getJmreportUrl() {
  return request({
    url: '/logo/jmreportUrl',
    method: 'get'
  })
}
