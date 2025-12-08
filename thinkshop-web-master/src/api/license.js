import request from '@/utils/request'

export function addAuthFileInfo(data) {
  return request({
    url: '/mall/app/license/addAuthFileInfo',
    method: 'post',
    data
  })
}

export function getAuthFileInfo(params) {
  return request({
    url: '/mall/app/license/info',
    method: 'get',
    params
  })
}

/*修改授权信息全部内容，文件以及过期时间*/
export function updAuthFileInfo(data) {
  return request({
    url: '/mall/app/license/modAuthFileInfo',
    method: 'post',
    data
  })
}
