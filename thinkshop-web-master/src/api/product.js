import request from '@/utils/request'

const pri = '/mall/app'

// 商品分类
export function categoryList() {
  return request({
    url: `${pri}/category/list`,
    method: 'get'
  })
}

// 分类商品
export function productList(params) {
  return request({
    url: `${pri}/product/list`,
    method: 'get',
    params
  })
}

// 商品详情
export function productDetail(id) {
  return request({
    url: `${pri}/product/get/${id}`,
    method: 'get'
  })
}

// 推荐好物
export function recommendPro(params) {
  return request({
    url: `${pri}/product/recommend-list`,
    method: 'get',
    params
  })
}

// 商品分组明细
export function queryGroupInfo(groupId) {
  return request({
    url: `${pri}/product/group/get/${groupId}`,
    method: 'get'
  })
}

// 查看商品评价
export function queryProComment(id, params) {
  return request({
    url: `${pri}/product/comments/${id}`,
    method: 'get',
    params
  })
}
// 商品评价
export function productComment(data) {
  return request({
    url: `${pri}/order/comment`,
    method: 'post',
    data
  })
}