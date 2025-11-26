<script setup>
import { defineComponent, onMounted, reactive, ref } from 'vue';
import Detail from "./detail.vue";
import AuditForm from "@/views/order/afterSaleOrder/components/AuditForm.vue";
import {getAfterSalesList, deleteOrder} from "@/api/afterSale/index.js";
import {getWebsitesetting} from "@/api/websiteSet/index.js";
const router = useRouter()
const {proxy} = getCurrentInstance()

defineComponent({
  name: 'OrderPage'
})

const loading = reactive({
  table: false,
  export: false,
})

const page = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const query = reactive({
  serviceType: '',
  userName: '',
  orderCode: '',
  startTime: '',
  endTime: ''
})
const dates = ref([])
const tableData = ref([]);
// 初始化查询所有数据
function getAll () {
  loading.table = true
  getAfterSalesList(Object.assign({}, {
    pageNum: page.pageNum,
    pageSize: page.pageSize
  }, query)).then(res => {
    tableData.value = res.rows
    page.total = res.total
  }).finally(() => {
    loading.table = false
  })
}
//  查询
function search () {
  query.startTime = dates.value[0]
  query.endTime = dates.value[1]
  page.page = 1
  getAll()
}
// 查看订单
function view (row) {
  router.push({path: '/order/afterSaleDetail', query: {id: row.id, currencySymbol: currencySymbol.value}})
}
// 审核
const auditFormRef = ref()
function goToAudit(data) {
  auditFormRef.value.show(data)
}
// 重置按钮
const queryFormRef = ref()
function resetQuery() {
  dates.value = []
  queryFormRef.value.resetFields()
  search()
}
// 导出订单
function orderDataExport () {
  loading.export = true
  orderExport(Object.assign({}, page, query)).then(res => {
    if (!res) {
      return
    }
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const fileName = '订单数据明细表.xls'
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.href = URL.createObjectURL(blob)
      elink.style.display = 'none'
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }).finally(() => {
    loading.export = false
  })
}
// 删除订单
function delOrder(row) {
  const {userDel, id} = row
  if(userDel===0) return proxy.$modal.msgWarning('无法删除用户未删除的订单')
  proxy.$modal.confirm('确定要删除该订单吗？', '删除提示')
  .then(() => {return deleteOrder(id)})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getAll()
  })

}
// 获取网站配置
const currencySymbol = ref('')
function getWebInfo() {
  getWebsitesetting().then((res) => {
    currencySymbol.value = res.data.currencySymbol
  }).catch(() => {
  })
}
onMounted(() => {
  // getWebInfo()
  getAll()
})
</script>

<template>
  <div class="app-container">
    <div class="tab_show">
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form
            :inline="true"
            :model="query"
            ref="queryFormRef"
            class="search-form"
        >
          <el-form-item label="创建时间">
            <el-date-picker
                v-model="dates"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="售后类型" prop="serviceType">
            <el-select
                v-model="query.serviceType"
                placeholder="请选择售后类型"
            >
              <el-option label="全部" :value="null" />
              <el-option label="仅退款" value="0" />
              <el-option label="退货退款" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单ID" prop="orderCode">
            <el-input
                v-model="query.orderCode"
                placeholder="请输入订单ID"
            />
          </el-form-item>
          <el-form-item label="下单用户" prop="userName">
            <el-input
                v-model="query.userName"
                placeholder="请输入下单用户"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
            v-loading="loading.table"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            class="dataTable"
        >
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.details">
                <el-table-column label="商品名称" prop="productName" />
                <el-table-column label="规格" prop="sku" />
                <el-table-column label="图片" prop="image">
                  <template #default="product">
                    <el-image
                        :src="product.row.image"
                        fit="cover"
                        style="width: 100px; height: 100px"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="售后数量" prop="num" />
                <el-table-column label="售价" prop="price">
                  <template #default="product">
                    <span>{{currencySymbol}}{{ product.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="实付价" prop="price">
                  <template #default="product">
                    <span>{{currencySymbol}}{{ product.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="售后合计" prop="totalPrice">
                  <template #default="product">
                    <span>{{currencySymbol}}{{ product.row.totalPrice }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="售后单号" width="220">
            <template #default="scope">{{ scope.row.afterSalesCode }}</template>
          </el-table-column>
          <el-table-column prop="orderCode" label="订单编号" show-overflow-tooltip />
          <el-table-column prop="refundAmount" label="售后金额">
            <template #default="scope">
              <span>{{currencySymbol}}{{scope.row.refundAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="refundNumber" width="120" label="售后商品数量"/>
          <el-table-column prop="userName" label="申请用户"/>
          <el-table-column label="售后类型" show-overflow-tooltip>
            <template #default="scope">
              <span v-if="scope.row.serviceType == 1">退货退款</span>
              <span v-if="scope.row.serviceType == 0">仅退款</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center" prop="createTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template #default="scope">
              <span v-if="scope.row.state == -2">售后失败</span>
              <span v-if="scope.row.state == -1">售后取消</span>
              <span v-if="scope.row.state == 0">待审核</span>
              <span v-if="scope.row.state == 1">待寄回货品</span>
              <span v-if="scope.row.state == 2">待商家收货</span>
              <span v-if="scope.row.state == 3">退款中</span>
              <span v-if="scope.row.state == 4">退款成功</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <div class="btnList">
                <el-button
                    v-if="scope.row.state === 0"
                    type="primary"
                    link
                    @click="goToAudit(scope.row)"
                >审核</el-button>
                <el-button
                    v-if="scope.row.state === 2"
                    type="primary"
                    link
                    @click="goToAudit(scope.row)"
                >确认收货</el-button>
                <el-button
                    type="primary"
                    link
                    @click="view(scope.row)"
                >详情</el-button>
                <el-button
                  type="danger"
                  link
                  @click="delOrder(scope.row)"
                  v-if="[4, -2, -1].includes(scope.row.state)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="page.total > 0"
            :total="page.total"
            v-model:page="page.page"
            v-model:limit="page.pageSize"
            @pagination="getAll"
        />
      </div>
    </div>
    <audit-form @rest="getAll" ref="auditFormRef"></audit-form>
  </div>
</template>
