<template>
  <div class="p24">
    <el-row :gutter="10" class="mb16">
      <el-col :span="1.5">
        <el-button
            type="primary"
            icon="Plus"
            @click="()=> {handleAdd({})}"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            @click="batchHandle"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-form :inline="true" ref="queryRef" :model="queryParams" class="search-form">
      <el-form-item label="计划名称" prop="name">
        <el-input placeholder="请输入计划名称" v-model="queryParams.name"/>
      </el-form-item>
      <el-form-item label="运营人群" prop="group">
        <el-select placeholder="请选择运营人群" v-model="queryParams.group">
          <el-option
            v-for="it in groupList"
            :key="it.id"
            :label="it.name"
            :value="it.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划方式" prop="planType">
        <el-select placeholder="请选择计划方式" v-model="queryParams.planType">
          <el-option label="自动长期计划" :value="1"/>
          <el-option label="手动定时计划" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="计划时间">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 运营人群列表 -->
    <el-table  v-loading="loading" :data="tableObj.rows" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="100" align="center" label="序号"/>
      <el-table-column align="center" label="计划名称" prop="name" key=""/>
      <el-table-column align="center" label="运营人群" prop="" key="">
        <template #default="scope">
          {{formatGroup(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="计划方式" prop="planType">
        <template #default="scope">
          {{`${scope.row.planType===2?'手动定时':'自动长期'}计划`}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" prop="" key="">
        <template #default="scope">
          {{formatDate(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="" key="">
        <template #default="scope">
          {{formatStatus(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="" key="" width="280">
        <template #default="scope">
          <el-button type="primary" link @click="handleAdd(scope.row)" v-if="scope.row.status!==1">编辑</el-button>
          <el-button type="primary" link @click="viewLog(scope.row)">数据</el-button>
          <el-button type="danger" link @click="delPlan(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableObj.total>0"
      :total="tableObj.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="运营数据"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
      v-model="showLog"
      center
      width="50%"
      class="s-dialog s-dialog-table"
    >
      <el-table
        v-loading="logLoading"
        :data="logData.rows"
        max-height="550"
      >
        <el-table-column label="日期" prop="dateStr" width="180"/>
        <el-table-column label="发券人数" prop="couponUserCount"/>
        <el-table-column label="下单人数" prop="orderUserCount"/>
        <el-table-column label="下单笔数" prop="orderCount"/>
        <el-table-column label="下单金额" prop="orderAmount"/>
        <el-table-column label="支付人数" prop="payUserCount"/>
        <el-table-column label="支付订单数" prop="payOrderCount"/>
      </el-table>
      <pagination
        v-show="logData.total>0"
        :total="logData.total"
        v-model:page="logQuery.pageNum"
        v-model:limit="logQuery.pageSize"
        @pagination="getLogData"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import {queryMemberPlan, queryGroup, delMemberPlan, operateLog} from '@/api/customer'
import moment from 'moment'
import { nextTick } from 'vue'

const {proxy} = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const defaultParams = {
  pageNum: 1,
  pageSize: 10,
  name: '',
  group: undefined,
  planType: '',
}
const queryParams = ref({...defaultParams})
const date = ref('')
const groupList = ref([])
const queryRef = ref(null)
const loading = ref(false)
const tableObj = ref({
  total: 1,
  rows: []
})
const selectedPlan = ref([])
// 运营数据
const showLog = ref(false)
const logLoading = ref(false)
const logData = ref({
  total: 0,
  rows: []
})
const defaultLogQuery = {
  planId: '',
  pageNum: 1,
  pageSize: 10
}
const logQuery = ref({...defaultLogQuery})

// 格式状态
function formatStatus(status) {
  const ob = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
  }
  return ob[status] || ''
}
// 格式时间
function formatDate(row) {
  const fn = t => moment(t).format('YYYY-MM-DD')
  const {planType, manualExecutionType, planStart, planEnd} = row
  if(planType===1) return planStart?`${fn(planStart)}至${fn(planEnd)}`:''
  if(planType===2&&manualExecutionType===2) return planStart?fn(planStart):''
}
// 格式人群信息
function formatGroup(row) {
  const {memberGroupList} = row
  if(memberGroupList?.length) {
    return memberGroupList.map(it => it.name).join('、')
  }
  return ''
}
function getList() {
  loading.value = true
  queryMemberPlan({
    ...queryParams.value,
    startTime: date.value[0],
    endTime: date.value[1]
  }).then(r => {
    const {total, rows} = r
    loading.value =false
    tableObj.value = {
      total, rows
    }
  })
}
// 分组数据
function getGroupData() {
  queryGroup({pageNum: 1, pageSize: 99}).then(r => {
    groupList.value = r.rows
  })
}
// 批量操作
function batchHandle() {
  if(selectedPlan.value.length) {
    delPlan(selectedPlan.value.join(','))
  } else {
    proxy.$modal.msgWarning('请选择要删除的计划')
  }
}
// 删除计划
function delPlan(ids) {
  proxy.$modal.confirm('确认删除该计划吗？', '删除提示')
  .then(() => {return delMemberPlan({ids})})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  })
}
function handleQuery() {
  Object.assign(queryParams.value, {
    pageNum: 1,
    pageSize: 10
  })
  getList()
}
function resetQuery() {
  proxy.resetForm("queryRef")
  date.value = ''
  handleQuery()
}
function handleAdd({id='', groupId=''}) {
  router.push({path: '/customerOperate/handle', query: {id, groupId}})
}
function handleSelectionChange(rows) {
  selectedPlan.value = rows.map(it => it.id)
}
// 运营数据
function close() {
  showLog.value = false
  logData.value = {total: 0, rows: []}
  logQuery.value = {...defaultLogQuery}
}
function viewLog(row) {
  showLog.value = true
  logQuery.value.planId = row.id
  getLogData()
}
function getLogData() {
  logLoading.value = true
  operateLog(logQuery.value).then(r => {
    const {total, rows} = r
    logLoading.value = false
    logData.value = {total, rows}
  })
}

// 人群运营
function groupOperate() {
  const {groupId} = route.query
  if(groupId)  {
    nextTick(() => {
      handleAdd({groupId})
    })
  }
}

getList()
getGroupData()
groupOperate()
</script>