import request from '@/utils/request'

// 查询订单规则
export function getOrderRule() {
  return request({
    url: '/system/orderRule',
    method: 'get'
  })
}

// 修改订单规则
export function upOrderRule(data) {
  return request({
    url: '/system/orderRule/update',
    method: 'put',
    data: data
  })
}

// 修改服务协议
export function updateServiceAgreement(data) {
  return request({
    url: '/mall/admin/agreement/save',
    method: 'post',
    data: data
  })
}

// 查询用户协议
export function getAgreement() {
  return request({
    url: '/mall/admin/agreement/get',
    method: 'get'
  })
}
