import request from '@/utils/request'

const pri = '/mall/app'

export function integralTotal() {
  return request({
    url: `${pri}/integral/balance`,
    method: 'get'
  })
}

export function integralBill(params) {
  return request({
    url: `${pri}/integral/bill`,
    method: 'get',
    params
  })
}

export function integralRule() {
  return request({
    url: `${pri}/integral/rule`,
    method: 'get'
  })
}