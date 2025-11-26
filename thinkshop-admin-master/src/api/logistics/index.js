import request from '@/utils/request'

// 查询物流方案列表
export function getLogisticsList(query) {
  return request({
    url: '/mall/admin/shipping-templates/list',
    method: 'get',
    params: query
  })
}

// 查询物流方案详细
export function getLogistics(id) {
  return request({
    url: '/mall/admin/shipping-templates/get/' + id,
    method: 'get'
  })
}

// 新增物流方案
export function addLogistics(data) {
  return request({
    url: '/mall/admin/shipping-templates/add',
    method: 'post',
    data: data
  })
}

// 修改物流方案
export function upLogistics(data) {
  return request({
    url: '/mall/admin/shipping-templates/update',
    method: 'put',
    data: data
  })
}


// 删除物流方案
export function delLogistics(id) {
  return request({
    url: '/mall/admin/shipping-templates/delete/' + id,
    method: 'delete'
  })
}

// 获取可选择商品列表
export function getSelectProduct(query) {
  return request({
    url: '/mall/admin/product/list',
    method: 'get',
    params: query
  })
}

// 获取所有国家和地区
export function getRegionList() {
  return request({
    url: '/mall/admin/regionList',
    method: 'get',
  })
}
