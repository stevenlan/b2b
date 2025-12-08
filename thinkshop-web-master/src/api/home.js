import request from '@/utils/request'

// 分类列表
export function categoryList(params) {
  return request({
    url: `/mall/app/category/list`,
    method: 'get',
    params
  })
}

// 新品
export function arrivalsList(params) {
  return request({
    url: `/mall/app/product/list`,
    method: 'get',
    params
  })
}

// 热卖
export function sellersList(params) {
  return request({
    url: `/mall/app/product/list`,
    method: 'get',
    params
  })
}

// 品牌
export function brandsList(params) {
  return request({
    url: `/mall/app/category/brandList`,
    method: 'get',
    params
  })
}

// 评价
export function psaysList(params) {
  return request({
    url: `/mall/app/product/commentsList`,
    method: 'get',
    params
  })
}

// 新闻
export function newsList(params) {
  return request({
    url: `/mall/app/listNews`,
    method: 'get',
    params
  })
}
//新闻详情
export function newsDetail(id) {
  return request({
    url: `/mall/app/getNewInfo/${id}`,
    method: 'get'
  })
}
