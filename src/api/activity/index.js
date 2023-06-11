import request from '@/utils/request'

// 查询活动信息列表
export function listInfo(query) {
  return request({
    url: '/activity/list',
    method: 'get',
    params: query
  })
}

// 查询活动信息详细
export function getInfo(id) {
  return request({
    url: '/activity/' + id,
    method: 'get'
  })
}

// 新增活动信息
export function addInfo(data) {
  return request({
    url: '/activity',
    method: 'post',
    data: data
  })
}

// 修改活动信息
export function updateInfo(data) {
  return request({
    url: '/activity',
    method: 'put',
    data: data
  })
}

// 删除活动信息
export function delInfo(id) {
  return request({
    url: '/activity/' + id,
    method: 'delete'
  })
}

// 导出活动信息
export function exportInfo(query) {
  return request({
    url: '/activity/export',
    method: 'get',
    params: query
  })
}

// 查询优惠券关联活动列表
export function getListByCoupon(query) {
  return request({
    url: '/activity/getListByCoupon',
    method: 'get',
    params: query
  })
}

// 审核活动信息
export function audit(data) {
  return request({
    url: '/activity/audit',
    method: 'post',
    data: data
  })
}

//提交活动审核
export function submitAudit(data){
  return request({
    url: '/activity/submitAudit',
    method: 'post',
    data: data
  })
}

//配置优惠券
export function submitCoupon(data){
  return request({
    url: '/activity/submitCoupon',
    method: 'post',
    data: data
  })
}

//指定用户
export function specifyUser(data){
  return request({
    url: '/activity/specifyUser',
    method: 'post',
    data: data
  })
}

//获取活动关联优惠券信息
export function grantCoupon(id){
  return request({
    url: '/activity/getGrantCoupon/'+id,
    method: 'get'
  })
}

//发放优惠券
export function submitGrant(data){
  return request({
    url: '/activity/grantCoupon',
    method: 'post',
    data: data
  })
}

//配置商户
export function configMerchant(data){
  return request({
    url: '/activity/configMerchant',
    method: 'post',
    data: data
  })
}

//停止活动
export function stopActivity(data){
  return request({
    url: '/activity/stop',
    method: 'post',
    data: data
  })
}

//重启活动
export function restartActivity(data){
  return request({
    url: '/activity/restart',
    method: 'post',
    data: data
  })
}

//获取卡属性用户信息
export function getCardUserInfo(data){
  return request({
    url: '/activity/getCardUserInfo/'+data,
    method: 'get'
  })
}

//获取商户列表
export function getMerchantList(data){
  return request({
    url: '/activity/getMerchantList/'+data,
    method: 'get'
  })
}

//获取已配置的商户列表
export function getConfigMerchant(data){
  return request({
    url: '/activity/getConfigMerchant/'+data,
    method: 'get'
  })
}








