import request from '@/utils/request'
const pri = '/mall/admin'
// 查询订单列表
export function getOrderList(query) {
  return request({
    url: `${pri}/order/list`,
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrderDetail(id) {
  return request({
    url: `${pri}/order/get/${id}`,
    method: 'get'
  })
}


// 订单发货
export function orderDelivery(data) {
  return request({
    url: `${pri}/order/delivery `,
    method: 'post',
    data: data
  })
}

// 查询订单物流
export function getOrderLogistics(id) {
  return request({
    url: `${pri}/order/logistics/${id}`,
    method: 'get'
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `${pri}/order/delete/${id}`,
    method: 'delete'
  })
}

