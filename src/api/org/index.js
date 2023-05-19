import request from '@/utils/request'

// 查询机构列表
export function listOrg(query) {
  return request({
    url: '/org/list',
    method: 'get',
    params: query
  })
}

// 查询机构详细
export function getOrg(id) {
  return request({
    url: '/org/' + id,
    method: 'get'
  })
}

// 新增机构
export function addOrg(data) {
  return request({
    url: '/org',
    method: 'post',
    data: data
  })
}

// 修改机构
export function updateOrg(data) {
  return request({
    url: '/org',
    method: 'put',
    data: data
  })
}

// 删除机构
export function delOrg(id) {
  return request({
    url: '/org/' + id,
    method: 'delete'
  })
}

// 导出机构
export function exportOrg(query) {
  return request({
    url: '/org/export',
    method: 'Post',
    params: query
  })
}
//机构审核
export function orgApprove(data){
  return request({
    url: '/org/audit',
    method: 'post',
    data: data
  })
}

//提交机构审核
export function submitAudit(data){
  return request({
    url: '/org/submitAudit',
    method: 'post',
    data: data
  })
}
