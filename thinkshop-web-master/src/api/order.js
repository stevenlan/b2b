import request from '@/utils/request'

const pri = '/mall/app'

// 订单列表
export function getOrderList(params) {
  return request({
    url: `${pri}/order/list`,
    method: 'get',
    params
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `${pri}/order/delete/${id}`,
    method: 'delete'
  })
}

// 获取订单详情
export function getOrderDetails(id) {
  return request({
    url: `${pri}/order/get/${id}`,
    method: 'get'
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: `${pri}/order/cancel/${id}`,
    method: 'get'
  })
}

// 获取订单物流信息
export function getOrderLogistics(id) {
  return request({
    url: `${pri}/order/logistics/${id}`,
    method: 'get'
  })
}

// 再次下单
export function getReorder(id) {
  return request({
    url: `${pri}/order/purchase-again/${id}`,
    method: 'get'
  })
}

// 确认收货
export function confirmReceiptOfGoods(id) {
  return request({
    url: `${pri}/order/receipt/${id}`,
    method: 'get'
  })
}
// 支付时间配置
export function orderConfig() {
  return request({
    url: `${pri}/websitesetting`,
    method: 'get'
  })
}
