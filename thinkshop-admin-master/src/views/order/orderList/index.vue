<script setup>
import { defineComponent, onMounted, reactive, ref } from 'vue';
import Detail from "./detail.vue";
import DeliverGoods from "@/views/order/orderList/components/DeliverGoods.vue";
import {getOrderList, deleteOrder} from "@/api/order/index.js";
import {getWebsitesetting} from "@/api/websiteSet/index.js";
const router = useRouter()
const  {proxy} = getCurrentInstance()

defineComponent({
  name: 'OrderPage'
})

const loading = reactive({
  table: false,
  export: false,
})

const page = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const tabsActive = ref('')
const query = reactive({
  userName: '',
  orderCode: '',
  status: '',
  startTime: '',
  endTime: ''
})

const dates = ref([])
const tableData = ref([]);
// 初始化查询所有数据
function getAll () {
  loading.table = true
  getOrderList(Object.assign({}, {
    pageNum: page.pageNum,
    pageSize: page.pageSize
  }, query)).then(res => {
    tableData.value = res.rows
    page.total = res.total
  }).finally(() => {
    loading.table = false
  })
}

function handleClick (tab) {
  page.page = 1
  query.status = tab.props && tab.props.name || ''
  getAll()
}
//  查询
function search () {
  query.startTime = dates.value[0]
  query.endTime = dates.value[1]
  page.page = 1
  getAll()
}
// 查看订单
function viewDetail (row) {
  router.push({path: '/order/detail', query: {id: row.id, currencySymbol: currencySymbol.value}})
}
// 发货
const deliverGoodsRef = ref()
function toDeliverGoods(id) {
  let data = {
    id: id
  }
  deliverGoodsRef.value.show(data)
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
  handleClick({ name: '' })
  // getWebInfo()
})
</script>

<template>
  <div class="app-container">
    <div class="tab_show">
      <el-tabs v-model="tabsActive" @tab-click="handleClick">
        <el-tab-pane label="全部" :name="''" />
        <el-tab-pane label="待付款" name="0" />
        <el-tab-pane label="待发货" name="1" />
        <el-tab-pane label="待收货" name="2" />
        <el-tab-pane label="已完成" name="3" />
        <el-tab-pane label="已取消" name="-1" />
      </el-tabs>
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form
            :inline="true"
            :model="query"
            ref="queryFormRef"
            class="search-form"
        >
          <el-form-item label="订单ID" prop="orderCode">
            <el-input
                v-model="query.orderCode"
                maxlength="100"
                placeholder="请输入订单ID"
            />
          </el-form-item>
          <el-form-item label="下单用户" prop="userName">
            <el-input
                v-model="query.userName"
                maxlength="100"
                placeholder="请输入下单用户"
            />
          </el-form-item>
          <el-form-item label="下单时间" prop="dates">
            <el-date-picker
                v-model="dates"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <!--            <el-button-->
            <!--                type="success"-->
            <!--                plain-->
            <!--                :loading="loading.export"-->
            <!--                @click="orderDataExport"-->
            <!--            >导出订单</el-button>-->
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
                <el-table-column label="图片" prop="city">
                  <template #default="product">
                    <el-image
                        :src="product.row.image"
                        fit="cover"
                        style="width: 100px; height: 100px"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="商品数量" prop="num" />
                <el-table-column label="售价" prop="price">
                  <template #default="product">
                    <span>{{currencySymbol}}{{ product.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="合计" prop="totalPrice">
                  <template #default="product">
                    <span>{{currencySymbol}}{{ product.row.totalPrice }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" width="220" prop="orderCode" />
          <el-table-column prop="totalPrice" label="商品总价" width="220">
            <template #default="scope">
              <span>{{currencySymbol}}{{scope.row.totalPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payPrice" label="实收款" width="220">
            <template #default="scope">
              <span>{{currencySymbol}}{{scope.row.payPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="totalNum"
              label="订单商品数量"
              show-overflow-tooltip
          />
          <el-table-column
              prop="userName"
              label="下单用户"
              show-overflow-tooltip
          />
          <el-table-column
              prop="createTime"
              label="下单时间"
              show-overflow-tooltip>
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template #default="scope">
              <span v-if="scope.row.status === 0">待付款</span>
              <span v-if="scope.row.status === 1">待发货</span>
              <span v-if="scope.row.status === 2">已发货</span>
              <span v-if="scope.row.status === 3">已完成</span>
              <span v-if="scope.row.status === -1">已取消</span>
              <span v-if="scope.row.status === -2">已退款</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <div class="btnList">
                <el-button
                    v-if="scope.row.status === 1"
                    type="primary"
                    link
                    @click="toDeliverGoods(scope.row.id)"
                >发货</el-button>
                <el-button
                    type="primary"
                    link
                    @click="viewDetail(scope.row)"
                >查看</el-button>
                <el-button
                  type="danger"
                  link
                  @click="delOrder(scope.row)"
                  v-if="[3,-1,-2].includes(scope.row.status)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="page.total > 0"
            :total="page.total"
            v-model:page="page.pageNum"
            v-model:limit="page.pageSize"
            @pagination="getAll"
        />
      </div>
    </div>
<!--    <detail ref="orderDetailRef"></detail>-->
    <deliver-goods @reset="getAll" ref="deliverGoodsRef"></deliver-goods>
  </div>
</template>
