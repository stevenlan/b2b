import request from '@/utils/request'

const pri = '/mall/app'

// 地址列表
export function addressList(params) {
  return request({
    url: `${pri}/address/list`,
    method: 'get',
    params
  })
}

// 获取地区
export function getAcquisitionArea() {
  return request({
    url: `${pri}/region/list`,
    method: 'get'
  })
}

// 添加地址
export function addAddress(data) {
  return request({
    url: `${pri}/address/add`,
    method: 'post',
    data
  })
}

// 修改地址
export function modifyAddress(data) {
  return request({
    url: `${pri}/address/update`,
    method: 'put',
    data
  })
}

// 修改默认地址
export function defaultAddress(id) {
  return request({
    url: `${pri}/address/set-default/${id}`,
    method: 'get'
  })
}

// 删除地址
export function deleteAddress(id) {
  return request({
    url: `${pri}/address/delete?addressIds=` + id,
    method: 'delete'
  })
}

// 获取地址详情
export function getAddressDetails(addressId) {
  return request({
    url: `${pri}/address/get/${addressId}`,
    method: 'get'
  })
}
