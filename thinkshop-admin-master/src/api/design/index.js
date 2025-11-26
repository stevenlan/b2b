import request from '@/utils/request'

const pri = '/mall/admin'

/* banner配置 */
export function queryBanner(params) {
  return request({
    url: `${pri}/banner/list`,
    method: 'get',
    params
  })
}
export function addBanner(data) {
  return request({
    url: `${pri}/banner/add`,
    method: 'post',
    data
  })
}
export function delBanner(id) {
  return request({
    url: `${pri}/banner/delete/${id}`,
    method: 'delete'
  })
}
export function updateBanner(data) {
  return request({
    url: `${pri}/banner/update`,
    method: 'put',
    data
  })
}
/* 页面页脚 */
// 页眉
export function queryHeader() {
  return request({
    url: `${pri}/pageDesign/get/pageTop`,
    method: 'get'
  })
}
// 页眉
export function queryFooter() {
  return request({
    url: `${pri}/pageDesign/get/pageBottom`,
    method: 'get'
  })
}
// 新增页眉。页脚
export function addHeader(data) {
  return request({
    url: `${pri}/pageDesign/add`,
    method: 'post',
    data
  })
}
// 编辑页眉、页脚
export function updateHeader(data) {
  return request({
    url: `${pri}/pageDesign/edit`,
    method: 'put',
    data
  })
}
/* 图文、视频 */
export function queryTextVideo(type) {
  return request({
    url: `${pri}/indexDesign/list`,
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 20,
      type // 0 视频 1图文
    }
  })
}
// 新增图文和视频
export function addTextVideo(data) {
  return request({
    url: `${pri}/indexDesign/add`,
    method: 'post',
    data
  })
}
// 删除
export function delTextVideo(id) {
  return request({
    url: `${pri}/indexDesign/delete/${id}`,
    method: 'delete'
  })
}
// 更新
export function updateTextVideo(data) {
  return request({
    url: `${pri}/indexDesign/update`,
    method: 'put',
    data
  })
}

/* 商品组合 */
export function queryDesignGroup() {
  return request({
    url: `${pri}/productGroupDesign/list`,
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 50
    }
  })
}
export function addDesignGroup(data) {
  return request({
    url: `${pri}/productGroupDesign/add`,
    method: 'post',
    data
  })
}
export function updateDesignGroup(data) {
  return request({
    url: `${pri}/productGroupDesign/updateStatus`,
    method: 'put',
    data
  })
}
export function delDesignGroup(id) {
  return request({
    url: `${pri}/productGroupDesign/delete/${id}`,
    method: 'delete'
  })
}

