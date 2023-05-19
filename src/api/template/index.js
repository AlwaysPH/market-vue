import request from '@/utils/request'

// 查询优惠券信息列表
export function listInfo(query) {
  return request({
    url: '/coupon/list',
    method: 'get',
    params: query
  })
}

// 查询优惠券信息详细
export function getInfo(id) {
  return request({
    url: '/coupon/' + id,
    method: 'get'
  })
}

// 新增优惠券信息
export function addInfo(data) {
  return request({
    url: '/coupon',
    method: 'post',
    data: data
  })
}

// 修改优惠券信息
export function updateInfo(data) {
  return request({
    url: '/coupon',
    method: 'put',
    data: data
  })
}

// 删除优惠券信息
export function delInfo(id) {
  return request({
    url: '/coupon/' + id,
    method: 'delete'
  })
}

// 导出优惠券信息
export function exportInfo(query) {
  return request({
    url: '/coupon/export',
    method: 'get',
    params: query
  })
}

// 获取新增关联的优惠券列表
export function getCouponDetailList(query) {
  return request({
    url: '/coupon/getCouponDetailList',
    method: 'get',
    params: query
  })
}

// 获取活动关联的优惠券列表
export function getActivityCouponList(query) {
  return request({
    url: '/coupon/getActivityCouponList',
    method: 'get',
    params: query
  })
}


