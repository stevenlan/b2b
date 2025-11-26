<script setup>
import { getCoupon, delCoupon, stopCoupon } from "@/api/coupon/index.js";
import CouponData from "./components/couponData.vue";
import {ElMessage, ElMessageBox} from "element-plus";
const router = useRouter()

const query = reactive({
  couponName: '', // 优惠券名称
  couponType: null, // 优惠券类型
  dates: [], // 创建时间数组
  startTime: '', // 创建时间开始时间
  endTime: '', // 创建时间结束时间
  status: null, // 优惠券状态
});
const page = reactive({
  pageNum: 1,
  pageSize: 10
});
const total = ref(null)
const loading = reactive({
  table: false,
});
const tableData = ref([]); // 优惠券数据
// 初始化查询所有数据
function getAll () {
  loading.table = true;
  query.type = 1;
  getCoupon(Object.assign({}, page, query)).then(res => {
    tableData.value = res.rows
    total.value = res.total
  }).finally(() => {
    loading.table = false;
  })
}
//  搜索优惠券
function search () {
  page.pageNum = 1
  if (query.dates.length !== 0) {
    query.startTime = query.dates[0]
    query.endTime = query.dates[1]
  }
  getAll()
}
// 初始化搜索
function clear () {
  query.couponName = ''
  query.couponType = null
  query.dates = []
  query.startTime = ''
  query.endTime = ''
  query.status = null
  getAll()
}
// 切换分页
function handleSizeChange (val) {
  page.pageSize = val
  getAll()
}
function handleCurrentChange (val) {
  page.pageNum = val
  getAll()
}
const couponFormRef = ref()
// 优惠券新增
function addActivity() {
  router.push({path: '/marketing/couponAdd'})
}
// 优惠券编辑
function editActivity(id, forbidden) {
  router.push({path: '/marketing/couponAdd', query: {id: id, forbidden: forbidden}})
}

// 优惠券详情数据
const couponDataRef = ref()
function visitActivity(id) {
  couponDataRef.value.showCouponData(id)
}
// 优惠券删除
function clickDelCoupon(id) {
  ElMessageBox.confirm('是否确定删除此项？', '提示').then(() => {
    delCoupon(id).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功!',
      })
      tableData.value = []
      getAll()
    }).catch((err) => {
      ElMessage({
        type: 'error',
        message: '删除失败!',
      })
    })
  }).catch(() => {
  });
}
// 停止优惠券活动
function clickStopCoupon(id) {
  ElMessageBox.confirm('是否停止此活动？', '提示').then(() => {
    stopCoupon(id).then(() => {
      ElMessage({
        type: 'success',
        message: '结束成功!',
      })
      tableData.value = []
      getAll()
    }).catch((err) => {
      ElMessage({
        type: 'error',
        message: '结束失败!',
      })
    })
  }).catch(() => {
  });
}

onMounted(() => {
  getAll()
})
</script>

<template>
  <div class="app-container">
    <div class="app-box">
      <el-button class="add-btn" type="primary" @click="addActivity"><el-icon :size="15"><Plus /></el-icon>新建优惠券</el-button>
      <div class="formSearch">
        <el-form
            :inline="true"
            :model="query"
            class="search-form"
        >
          <el-form-item label="优惠券名称">
            <el-input
                v-model="query.couponName"
                maxlength="20"
                placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="优惠券类型">
            <el-select
                v-model="query.couponType"
                placeholder="请选择优惠券类型"
            >
              <el-option label="满减券" value="1" />
              <el-option label="折扣券" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="请选择优惠券状态">
              <el-option label="未开始" value="0" />
              <el-option label="进行中" value="1" />
              <el-option label="已结束" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table
          v-loading="loading.table"
          :data="tableData"
          :header-cell-style="{
        background: '#EEF3FF',
        color: '#333333'
      }"
          tooltip-effect="dark"
          style="width: 100%"
          class="dataTable"
      >
        <el-table-column label="优惠券名称" width="220">
          <template #default="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column label="优惠券ID" width="150" show-overflow-tooltip prop="id" />
        <el-table-column prop="createTime" label="活动时间" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.expirationType === 1">{{parseTime(scope.row.takingEffectTime)}}至{{parseTime(scope.row.expirationTime)}}</span>
            <span v-if="scope.row.expirationType === 2">领取后{{scope.row.expirationDay}}天有效</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponCode" label="兑换码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="优惠内容" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="已领取/剩余数量" width="140" prop="id">
          <template #default="scope">
            {{ scope.row.receivedNumber }}/{{ scope.row.number - scope.row.receivedNumber}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <span v-if="scope.row.status === 0">未开始</span>
            <span v-if="scope.row.status === 1">进行中</span>
            <span v-if="scope.row.status === 2">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <div class="btnList">
              <el-button
                  v-if="scope.row.status === 0"
                  type="primary"
                  link
                  @click="editActivity(scope.row.id)"
              >编辑</el-button>
              <el-button
                  v-if="scope.row.status !== 0"
                  type="primary"
                  link
                  @click="editActivity(scope.row.id, true)"
              >详情</el-button>
              <el-button
                  v-if="scope.row.status !== 0"
                  type="primary"
                  link
                  @click="visitActivity(scope.row.id)"
              >数据</el-button>
              <el-button
                  v-if="scope.row.status === 0 || scope.row.status === 2"
                  link
                  @click="clickDelCoupon(scope.row.id)"
                  type="danger"
              >删除</el-button>
              <el-button
                  v-if="scope.row.status === 1"
                  link
                  @click="clickStopCoupon(scope.row.id)"
                  type="danger"
              >停止</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="page.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total"
          style="margin: 12px 0;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
    <coupon-data ref="couponDataRef"></coupon-data>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  .app-box {
    padding: 16px;
  }
  .add-btn {
    margin-bottom: 16px;
  }
}
</style>
