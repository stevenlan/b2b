import request from '@/utils/request'
const pri = '/mall/admin'
// 查询售后订单列表
export function getAfterSalesList(query) {
  return request({
    url: `${pri}/sales/list`,
    method: 'get',
    params: query
  })
}

// 查询售后订单详细
export function getAfterSales(id) {
  return request({
    url: `${pri}/sales/get/${id}`,
    method: 'get'
  })
}


// 售后审核
export function afterSalesAudit(data) {
  return request({
    url: `${pri}/sales/audit `,
    method: 'post',
    data: data
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `${pri}/sales/delete/${id}`,
    method: 'delete'
  })
}
