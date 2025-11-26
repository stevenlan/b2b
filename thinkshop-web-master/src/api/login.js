import request from '@/utils/request'

const pri = '/mall/app/user'

// 注册
export function register(data) {
  return request({
    url: `${pri}/register`,
    method: 'post',
    data
  })
}

// 登录
export function login(data) {
  return request({
    url: '/auth/app/auth/login',
    method: 'post',
    data
  })
}

// 用户协议
export function userDeal(params) {
  return request({
    url: `/mall/app/getAgreement`,
    method: 'get',
    params
  })
}

// 网站配置
export function websiteConfig() {
  return request({
    url: '/mall/app/websitesetting',
    method: 'get'
  })
}
// 字典配置
export function dictConfig(type) {
  return request({
    url: `/system/app/dict/data/type/${type}`
  })
}

// 三方登录
export function googleLogin() {
  return request({
    url: '/auth/app/auth/render/google-web',
    method: 'get'
  })
}
export function facebookLogin() {
  return request({
    url: '/auth/app/auth/render/facebook-web',
    method: 'get'
  })
}

// 退登
export function logout() {
  return request({
    url: '/auth/app/auth/logout',
    method: 'delete'
  })
}

// 个人信息
export function getInfo(open) {
  return request({
    url: `${pri}/info`,
    method: 'get',
    open
  })
}

// 修改个人信息
export function userInfoUpdate(data) {
  return request({
    url: `${pri}/update`,
    method: 'post',
    data
  })
}
// 忘记密码获取验证码
export function getCode(params) {
  return request({
    url: '/mall/verification-code/email-forget',
    method: 'get',
    params
  })
}

// 注册获取密码
export function getSignCode(params) {
  return request({
    url: '/mall/verification-code/email',
    method: 'get',
    params
  })
}

// 忘记密码
export function forgetPassword(data) {
  return request({
    url: `${pri}/forgetPassword`,
    method: 'post',
    data
  })
}

// 首页配置
export function getHomeDesign() {
  return request({
    url: '/mall/app/design/index',
    method: 'get'
  })
}
// 首页页眉页脚配置
export function designConfig() {
  return request({
    url: 'mall/app/design/page',
    method: 'get'
  })
}
