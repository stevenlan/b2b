import request from '@/utils/request'

// 查询新闻列表
export function listNews(query) {
  return request({
    url: '/mall/admin/siteNew/list',
    method: 'get',
    params: query
  })
}

// 查询新闻详细
export function getNews(noticeId) {
  return request({
    url: '/mall/admin/siteNew/info/' + noticeId,
    method: 'get'
  })
}

// 新增新闻
export function addNews(data) {
  return request({
    url: '/mall/admin/siteNew/add',
    method: 'post',
    data: data
  })
}

// 修改新闻
export function updateNews(data) {
  return request({
    url: '/mall/admin/siteNew/update',
    method: 'post',
    data: data
  })
}

// 删除新闻
export function delNews(noticeId) {
  return request({
    url: '/mall/admin/siteNew/remove/' + noticeId,
    method: 'get'
  })
}
