import request from '@/utils/request'

const pri = '/mall/app/cart'

// 购物车列表
export function queryCart(open=false) {
  return request({
    url: `${pri}/my-cart`,
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 99
    },
    open
  })
}
// 添加购物车
export function addCart(data) {
  return request({
    url: `${pri}/add`,
    method: 'post',
    data
  })
}
// 编辑购物车
export function updateCart(data) {
  return request({
    url: `${pri}/update`,
    method: 'put',
    data
  })
}
// 删除购物车
export function delCart(params) {
  return request({
    url: `${pri}/delete`,
    method: 'delete',
    params
  })
}