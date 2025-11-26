import request from '@/utils/request'
const url = '/mall/admin'
// 新增优惠券
export function addCoupon(data) {
  return request({
    url: `${url}/coupon/add`,
    method: 'post',
    data,
  })
}
// 优惠券列表查询
export function getCoupon(params) {
  return request({
    url: `${url}/coupon/list`,
    method: 'get',
    params,
  })
}
// 优惠券数据效果查询
export function getCouponData(id) {
  return request({
    url: `${url}/coupon/data/${id}`,
    method: 'get'
  })
}
// 获取可选中商品
export function getProducts(params) {
  return request({
    url: `${url}/product/list`,
    method: 'get',
    params,
  })
}
// 删除满减券
export function delCoupon(ids) {
  return request({
    url: `${url}/coupon/delete?ids=${ids}`,
    method: 'DELETE'
  })
}
// 修改满减券/折扣券
export function updateCoupon(data) {
  return request({
    url: `${url}/coupon/update`,
    method: 'put',
    data,
  })
}
// 获取优惠券详情
export function couponDetail(id) {
  return request({
    url: `${url}/coupon/get/${id}`,
    method: 'get',
  })
}
// 停止活动
export function stopCoupon(id) {
  return request({
    url: `${url}/coupon/end/${id}`,
    method: 'get'
  })
}
