import request from '@/utils/request'

// 查询机构列表
export function listOrg(query) {
  return request({
    url: '/org/list',
    method: 'get',
    params: query
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
