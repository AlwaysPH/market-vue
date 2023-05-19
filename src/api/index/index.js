import request from '@/utils/request'

// 获取统计数据
export function getSummary(query) {
  return request({
    url: '/index/getSummaryData',
    method: 'get',
    params: query
  })
}

// 获取统计列表数据
export function listInfo(query) {
  return request({
    url: '/index/getSummaryListData',
    method: 'get',
    params: query
  })
}

