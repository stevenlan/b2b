import request from '@/utils/request'

const pri = '/mall/app'
// 获取优惠券列表
export function getUserCoupon(type) {
  return request({
    url: `${pri}/coupon/searchUserCoupon/${type}`,
    method: 'get',
  })
}
// 兑换优惠券
export function redeemCoupons(couponCode) {
  return request({
    url: `${pri}/coupon/redeem/${couponCode}`,
    method: 'get',
  })
}
