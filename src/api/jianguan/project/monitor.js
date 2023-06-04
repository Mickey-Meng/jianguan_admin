import request from '@/utils/request'

// 查询设备监控列表
export function listMonitor(query) {
  return request({
    url: '/system/jg/project/monitor/page',
    method: 'get',
    params: query
  })
}

// 查询设备监控详细
export function getMonitors(projectId) {
  return request({
    url: '/system/jg/project/monitor/' + projectId,
    method: 'get'
  })
}

// 保存设备监控
export function saveMonitors(projectId, data) {
  return request({
    url: '/system/jg/project/monitor/save/' + projectId,
    method: 'post',
    data: data
  })
}
