import request from '@/utils/request'

// 查询用户领取优惠券列表
export function listInfo(query) {
  return request({
    url: '/center/list',
    method: 'get',
    params: query
  })
}


// 导出用户领取优惠券列表
export function exportInfo(query) {
  return request({
    url: '/center/export',
    method: 'POST',
    params: query
  })
}
