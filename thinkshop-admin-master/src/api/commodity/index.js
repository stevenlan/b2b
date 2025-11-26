import request from '@/utils/request'

const pri = '/mall/admin'
/* 商品分组 */
export function queryGroup(params) {
  return request({
    url: `${pri}/group/list`,
    method: 'get',
    params
  })
}
export function addGroup(data) {
  return request({
    url: `${pri}/group/add`,
    method: 'post',
    data
  })
}
export function editGroup(data) {
  return request({
    url: `${pri}/group/update`,
    method: 'put',
    data
  })
}
export function groupInfo(id) {
  return request({
    url: `${pri}/group/get/${id}`,
    method: 'get'
  })
}
export function delGroup(params) {
  return request({
    url: `${pri}/group/delete`,
    method: 'delete',
    params
  })
}
export function removeProduct(data) {
  return request({
    url: `${pri}/group/remove-product`,
    method: 'post',
    data
  })
}

/* 商品类目 */
export function queryCategory(params) {
  return request({
    url: `${pri}/category/list`,
    method: 'get',
    params
  })
}
export function addCategory(data) {
  return request({
    url: `${pri}/category/add`,
    method: 'post',
    data
  })
}
export function updateCategory(data) {
  return request({
    url: `${pri}/category/update`,
    method: 'put',
    data
  })
}
export function delCategory(params) {
  return request({
    url: `${pri}/category/delete`,
    method: 'delete',
    params
  })
}
export function categoryInfo(id) {
  return request({
    url: `${pri}/category/get/${id}`,
    method: 'get'
  })
}
export function bindProduct(data) {
  return request({
    url: `${pri}/category/relation`,
    method: 'post',
    data
  })
}
export function unbindProduct(params) {
  return request({
    url: `${pri}/category/cancel`,
    method: 'get',
    params
  })
}
export function levelCategory(level) {
  return request({
    url: `${pri}/category/level-list/${level}`,
    method: 'get',
  })
}
/* 商品管理 */
export function queryProduct(params) {
  return request({
    url: `${pri}/product/list`,
    method: 'get',
    params
  })
}
export function addProduct(data) {
  return request({
    url: `${pri}/product/add`,
    method: 'post',
    data
  })
}
export function updateProduct(data) {
  return request({
    url: `${pri}/product/update`,
    method: 'put',
    data
  })
}
export function delProduct(params) {
  return request({
    url: `${pri}/product/delete`,
    method: 'delete',
    params
  })
}
export function productInfo(id) {
  return request({
    url: `${pri}/product/get/${id}`,
    method: 'get'
  })
}
export function displayProduct(params) {
  return request({
    url: `${pri}/product/grounding`,
    method: 'get',
    params
  })
}
export function filterProduct(data) {
  return request({
    url: `${pri}/product/intelligent/search`,
    method: 'post',
    data
  })
}
export function formatAttr(id, data) {
  return request({
    url: `${pri}/product/isFormatAttr/${id}`,
    method: 'post',
    data
  })
}

export function uploadFileApi (data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/* 商品评论 */
export function queryComment(params) {
  return request({
    url: `${pri}/comment/list`,
    method: 'get',
    params
  })
}
export function addComment(data) {
  return request({
    url: `${pri}/comment/add`,
    method: 'post',
    data
  })
}
export function updateComment(id, status) {
  return request({
    url: `${pri}/comment/status/${id}/${status}`,
    method: 'put'
  })
}
export function delComment(params) {
  return request({
    url: `${pri}/comment/delete`,
    method: 'delete',
    params
  })
}