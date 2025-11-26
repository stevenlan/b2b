<template>
  <div class="mb24">
    <el-form
      :inline="true"
      :model="query"
      label-width="68px"
      ref="queryRef"
      class="search-form"
    >
      <el-form-item label="变动时间">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="变动类型" prop="type">
        <el-select
          v-model="query.type"
          placeholder="请选择变动类型"
        >
          <el-option
            :label="it.label"
            :value="it.value"
            v-for="it in typeList"
            :key="it.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="query.email"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table  v-loading="loading" :data="tableOb.rows">
      <el-table-column prop="" label="NAME">
        <template #default="scope">
          <p>
            {{scope.row.firstName}}{{scope.row.lastName}}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="createTime" label="变动时间"/>
      <el-table-column prop="integral" label="积分变动"/>
      <el-table-column prop="" label="变动类型">
        <template #default="scope">
          <span>{{formatType(scope.row.billType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userIntegral" label="剩余积分"/>
    </el-table>
    <pagination
      v-show="tableOb.total>0"
      :total="tableOb.total"
      v-model:page="query.pageNum"
      v-model:limit="query.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup>
import {queryIntegral} from '@/api/customer'

const query = ref({
  pageNum: 1,
  pageSize: 10
})
const queryRef = ref(null)
const dateRange =  ref([])
const loading = ref(false)
const tableOb = reactive({
  total: 1,
  rows: []
})
const typeList = shallowRef([
  {label: '消费获取', value: 1},
  {label: '下单抵扣', value: 2},
  {label: '积分清零', value: 3},
  {label: '订单取消', value: 4},
  {label: '售后退还', value: 5},
])

// 格式类型
function formatType(type) {
  return typeList.value.find(it=>it.value===type)?.label||''
}

function getList() {
  loading.value = true
  queryIntegral({
    ...query.value,
    startTime: dateRange.value[0],
    endTime: dateRange.value[1]
  }).then(res => {
    const {total, rows} = res
    loading.value = false
    Object.assign(tableOb, {
      total,
      rows
    })
  })
}
function search() {
  query.value.pageNum = 1
  getList()
}
function reset() {
  dateRange.value = []
  query.value = {
    pageNum: 1,
    pageSize: 10
  }
  getList()
}

getList()
</script>