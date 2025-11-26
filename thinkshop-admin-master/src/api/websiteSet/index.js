import request from '@/utils/request'
const pri = '/mall/admin'

// 查询网站配置
export function getWebsitesetting() {
  return request({
    url: `${pri}/websitesetting`,
    method: 'get'
  })
}

// 修改网站配置
export function changeWebsitesetting(data) {
  return request({
    url: `${pri}/websitesetting`,
    method: 'post',
    data
  })
}

/* 系统消息 */
export function querySysMessage() {
  return request({
    url: `${pri}/messageTemplate/list`,
    method: 'get'
  })
}
export function sysMessageInfo(id) {
  return request({
    url: `${pri}/messageTemplate/get/${id}`,
    method: 'get'
  })
}
export function updateSysMessage(data) {
  return request({
    url: `${pri}/messageTemplate/update`,
    method: 'put',
    data
  })
}
/* 通知公告 */
export function addNotice(data) {
  return request({
    url: `/system/notice/add`,
    method: 'post',
    data
  })
}
export function updateNotice(data) {
  return request({
    url: `/system/notice/edit`,
    method: 'put',
    data
  })
}
export function delNotice(ids) {
  return request({
    url: `/system/notice/delete/${ids}`,
    method: 'delete'
  })
}
export function queryNotice(params) {
  return request({
    url: `/system/notice/list`,
    method: 'get',
    params
  })
}
export function queryNoticeInfo(id) {
  return request({
    url: `/system/notice/${id}`,
    method: 'get'
  })
}