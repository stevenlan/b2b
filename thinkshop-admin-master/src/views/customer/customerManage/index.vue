<template>
  <div class="p24">
    <el-form
      :inline="true"
      :model="query"
      class="search-form"
    >
      <el-form-item label="上次消费时间">
        <el-date-picker
          v-model="consumeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :shortcuts="shortcuts"
        />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="query.email"
                  placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="客户标签">
        <el-select
          v-model="query.tagIds"
          placeholder="请选择标签"
          :multiple="true">
          <el-option v-for="it in tagList" :value="it.id" :label="it.name"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableObj.rows"
      style="width: 100%;"
      v-loading="loading"
      tooltip-effect="dark"
    >
      <el-table-column label="NAME" prop="">
        <template #default="scope">
          {{ scope.row.firstName || ''}}
          {{ scope.row.lastName || ''}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="积分" prop="integral" />
      <el-table-column label="消费次数" prop="orderCount" />
      <el-table-column label="累计消费金额" prop="totalOrderAmount" />
      <el-table-column
        label="上次消费时间"
        prop="lastConsumeTime">
        <template #default="scope">
          {{parseTime(scope.row.lastConsumeTime)}}
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createTime">
        <template #default="scope">
          {{parseTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column
        label="客户标签"
        prop="tagName">
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            text
            type="primary"
            @click="handleItem(scope.row, 'label')"
          >加标签</el-button>
          <!-- <el-button text
            type="primary"
            @click="handleItem(scope.row, 'info')">详情</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableObj.total>0"
      :total="tableObj.total"
      v-model:page="query.pageNum"
      v-model:limit="query.pageSize"
      @pagination="getList"
    />
    <CustomerInfo ref="infoRef" />
    <LabelModal ref="labelRef" :tag-list="tagList" @refresh="getList"/>
  </div>
</template>

<script setup>
import { queryUser, queryTag } from '@/api/customer'
import CustomerInfo from "./customerInfo.vue"
import LabelModal from "./labelModal.vue"
const defaultQuery = {
  email: '',
  tagIds: [],
  pageNum: 1,
  pageSize: 10
}
const query = reactive({ ...defaultQuery })
const tableObj = reactive({
  total: 0,
  rows: []
})
const consumeDate = ref('')
const date = ref('')
const loading = ref(false)
const tagList = ref([])
const infoRef = ref(null)
const labelRef = ref(null)

const shortcuts = [
  {
    text: '今日',
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: '近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近1月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]

// 查询用户列表
function getList () {
  loading.value = true
  const params = {
    ...query,
    tagIds: query.tagIds.join(','),
    startCreateTime: date.value[0],
    endCreateTime: date.value[1],
    startLastConsumeTime: consumeDate.value[0],
    endLastConsumeTime: consumeDate.value[1],
  }
  queryUser(params).then(r => {
    loading.value = false
    const {total, rows} = r
    rows.forEach(it => {
      it.tagName = it.tagList?.length?it.tagList.map(it=>it.tagName).join(','):''
    })
    Object.assign(tableObj, {
      total: r.total,
      rows: r.rows
    })
  })
}
// 查询所有标签
function getTagList() {
  queryTag({pageNum: 1, pageSize: 99}).then(r => {
    tagList.value = r.rows
  })
}
function search () {
  query.pageNum = 1
  getList()
}
function reset () {
  Object.assign(query, defaultQuery)
  date.value = []
  consumeDate.value = []
  getList()
}
// 加标签、详情
function handleItem (row, type) {
  const tRef = type === 'label' ? labelRef : infoRef
  tRef.value.open(row)
}

getList()
getTagList()
</script>