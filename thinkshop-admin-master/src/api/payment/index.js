import request from '@/utils/request'

// 查询支付配置
export function getPaymentList() {
  return request({
    url: '/mall/admin/payment-config/list',
    method: 'get'
  })
}

// 查询支付配置详情
export function getPaymentDetail(id) {
  return request({
    url: '/mall/admin/payment-config/get/' + id ,
    method: 'get'
  })
}

// 修改支付配置
export function upPayment(data) {
  return request({
    url: '/mall/admin/payment-config/update',
    method: 'put',
    data: data
  })
}
