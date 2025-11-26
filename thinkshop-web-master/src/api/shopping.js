import request from '@/utils/request'

const pri = '/mall/app'

// 查询商品可用优惠券
export function queryCartCoupon(params) {
  return request({
    url: `${pri}/cart/coupon`,
    method: 'get',
    params
  })
}
// 兑换优惠券
export function exChangeCoupon(couponCode) {
  return request({
    url: `${pri}/coupon/redeem/${couponCode}`,
    method: 'get'
  })
}

// 下单前的订单信息
export function preShopInfo(data) {
  return request({
    url: `${pri}/order/confirm`,
    method: 'post',
    data
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: `${pri}/order/create`,
    method: 'post',
    data
  })
}

// 订单详情
export function queryOrderInfo(orderId) {
  return request({
    url: `${pri}/order/get/${orderId}`,
    method: 'get'
  })
}

// 支付配置
export function payConfig() {
  return request({
    url: `${pri}/payment/config`,
    method: 'get'
  })
}

// 支付下单
export function payOrder( data) {
  return request({
    url: `${pri}/payment`,
    method: 'post',
    data
  })
}

// 支付时间配置
export function orderConfig() {
  return request({
    url: `${pri}/websitesetting`,
    method: 'get'
  })
}