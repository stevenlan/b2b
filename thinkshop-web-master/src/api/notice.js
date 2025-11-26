import request from '@/utils/request'

const pri = '/system/app'

export function queryNotice() {
  return request({
    url: `${pri}/notice/list`,
    method: 'get'
  })
}
export function queryNoticeInfo(id) {
  return request({
    url: `${pri}/notice/${id}`,
    method: 'get'
  })
}
export function queryMsg() {
  return request({
    url: `/mall/app/message/list`,
    method: 'get'
  })
}
export function queryMsgInfo(id) {
  return request({
    url: `/mall/app/message//get/${id}`,
    method: 'get'
  })
}