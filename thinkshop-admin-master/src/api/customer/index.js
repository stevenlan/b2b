import request from '@/utils/request'

const pri = '/mall/admin'

/* ---客户管理--- */
// 客户列表
export function queryUser(params) {
  return request({
    url: `${pri}/user/list`,
    method: 'get',
    params
  })
}
// 客户详情
export function queryUserInfo(id) {
  return request({
    url: `${pri}/user/get/${id}`,
    method: 'get'
  })
}
// 加标签
export function addUserTag(data) {
  return request({
    url: `${pri}/user/updateTag`,
    method: 'post',
    data
  })
}

/* ---客户分群---- */
// 查询分群列表
export function queryGroup(params) {
  return request({
    url: `${pri}/memberGroup/list`,
    method: 'get',
    params
  })
}
// 分群详情
export function queryGroupInfo(id) {
  return request({
    url: `${pri}/memberGroup/get/${id}`,
    method: 'get'
  })
}
// 条件字典
export function groupDict() {
  return request({
    url: `${pri}/memberGroup/traitOption`,
    method: 'get'
  })
}
// 新增分群
export function addGroup(data) {
  return request({
    url: `${pri}/memberGroup/add`,
    method: 'post',
    data
  })
}
// 修改分群
export function updateGroup(data) {
  return request({
    url: `${pri}/memberGroup/update`,
    method: 'put',
    data
  })
}
// 删除分群
export function delGroup(params) {
  return request({
    url: `${pri}/memberGroup//delete`,
    method: 'delete',
    params
  })
}
// 分群客户
export function groupMembers(id, params) {
  return request({
    url: `${pri}/memberGroup//detail/${id}`,
    method: 'get',
    params
  })
}
// 分群详情
export function groupInfo(id) {
  return request({
    url: `${pri}/memberGroup/get/${id}`,
    method: 'get'
  })
}


/* ---客户标签---- */
export function queryTag(params) {
  return request({
    url: `${pri}/member-tag/list`,
    method: 'get',
    params
  })
}
export function addTag(data) {
  return request({
    url: `${pri}/member-tag/add`,
    method: 'post',
    data
  })
}
export function updateTag(data) {
  return request({
    url: `${pri}/member-tag/update`,
    method: 'put',
    data
  })
}
export function delTag(params) {
  return request({
    url: `${pri}/member-tag/delete`,
    method: 'delete',
    params
  })
}

/*---客户运营--- */
export function queryMemberPlan(params) {
  return request({
    url: `${pri}/memberPlan/list`,
    method: 'get',
    params
  })
}
export function addMemberPlan(data) {
  return request({
    url: `${pri}/memberPlan/add`,
    method: 'post',
    data
  })
}
export function updateMemberPlan(data) {
  return request({
    url: `${pri}/memberPlan/update`,
    method: 'put',
    data
  })
}
export function delMemberPlan(params) {
  return request({
    url: `${pri}/memberPlan/delete`,
    method: 'delete',
    params
  })
}
export function queryMemberPlanInfo(id) {
  return request({
    url: `${pri}/memberPlan/get/${id}`,
    method: 'get'
  })
}
// 客户运营数据
export function operateLog(params) {
  return request({
    url: `${pri}/operation-log/list`,
    method: 'get',
    params
  })
}

/* ---首页统计--- */
export function userStatics(params) {
  return request({
    url: `${pri}/index/statistics`,
    method: 'get',
    params
  })
}

/* ----客户积分---- */
export function queryIntegral(params) {
  return request({
    url: `${pri}/integralBill/list`,
    method: 'get',
    params
  })
}
export function queryIntegralRule() {
  return request({
    url: `${pri}/integralRule/get`,
    method: 'get',
  })
}
export function updateIntegralRule(data) {
  return request({
    url: `${pri}/integralRule/update`,
    method: 'put',
    data
  })
}

/* ---审核管理--- */
// 审核列表
export function queryLicense(params) {
  return request({
    url: `${pri}/license/list`,
    method: 'get',
    params
  })
}
// 审核详情
export function queryLicenseInfo(id) {
  return request({
    url: `${pri}/license/get/${id}`,
    method: 'get'
  })
}
// 审核通过
export function approveLicense(params) {
  return request({
    url: `${pri}/license/approve`,
    method: 'put',
    params
  })
}
// 审核驳回
export function refuseLicense(params) {
  return request({
    url: `${pri}/license/refuse`,
    method: 'put',
    params
  })
}