import request from '@/utils/request'

const pri = '/mall/app'

// 售后订单列表
export function getOrderList(params) {
  return request({
    url: `${pri}/sales/list`,
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetails(id) {
  return request({
    url: `${pri}/sales/get/${id}`,
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

// 申请售后
export function applyForAfterSales(data) {
  return request({
    url: `${pri}/sales/apply`,
    method: 'post',
    data
  })
}

// 撤销申请
export function withdrawalApplication(id) {
  return request({
    url: `${pri}/sales/cancel/${id}`,
    method: 'get'
  })
}
// 删除售后记录
export function deleteAfterSale(id) {
  return request({
    url: `${pri}/sales/delete/${id}`,
    method: 'delete'
  })
}

// 获取物流公司列表
export function getDeliveryCompany() {
  return request({
    url: `${pri}/delivery-company/simple-list`,
    method: 'get'
  })
}


// 填写物流信息
export function sendLogisticsInfo(data) {
  return request({
    url: `${pri}/sales/send`,
    method: 'post',
    data
  })
}
