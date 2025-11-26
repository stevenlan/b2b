<template>
  <div class="p-record">
    <div class="mb16">
      <el-button
        type="danger"
        plain
        @click="handleDelete()"
      >批量删除</el-button>
      <el-button
        type="primary"
        icon="Plus"
        @click="handleNotice()"
      >新增公告</el-button>
    </div>
    <el-form
      :inline="true"
      :model="query"
      label-width="68px"
      ref="queryRef"
      class="search-form"
    >
      <el-form-item label="标题" prop="noticeTitle">
        <el-input
          v-model="query.noticeTitle"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="query.status"
          placeholder="请选择状态"
        >
          <el-option
            :label="it.label"
            :value="it.value"
            v-for="it in typeList"
            :key="it.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table  v-loading="loading" :data="tableObj.rows" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="公告ID" prop="noticeId" width="80"/>
      <el-table-column label="标题" prop="noticeTitle"/>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          {{scope.row.status==='1'?'未发布':'已发布'}}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createBy"/>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{parseTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button type="primary" link v-if="scope.row.status==='1'" @click="changeNoticeStatus(scope.row)">发布</el-button>
          <el-button type="primary" link v-else @click="changeNoticeStatus(scope.row)" >取消发布</el-button>
          <el-button type="primary" link @click="handleNotice(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
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
  </div>
</template>

<script setup>
import {queryNotice, delNotice, updateNotice} from '@/api/websiteSet'

const router = useRouter()
const {proxy} = getCurrentInstance()

const query = ref({
  pageNum: 1,
  pageSize: 10
})
const queryRef = ref(null)
const loading = ref(false)
const tableObj = ref({
  total: 1,
  rows: []
})
const typeList = shallowRef([
  {label: '已发布', value: 0},
  {label: '未发布', value: 1}
])
const selectedRows = ref([])

function handleDelete(row) {
  const noticeIds = row?row.noticeId:selectedRows.value.join(',')
  if(!noticeIds) return proxy.$modal.msgWarning('请选择要删除的公告')
  proxy.$modal.confirm('确定要删除该公告吗？', '删除提示')
  .then(() => {return delNotice(noticeIds)})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  })
}
//发布、取消发布
function changeNoticeStatus(row) {
  const {status} = row
  const text = status==='0'?'取消':''
  updateNotice({...row, status: status==='0'?'1':'0'}).then(r=> {
    proxy.$modal.msgSuccess(`${text}发布成功`)
    getList()
  })
}
function getList() {
  loading.value = true
  queryNotice(query.value).then(r => {
    tableObj.value = {
      total: r.total,
      rows: r.rows
    }
    loading.value = false
  })
}
// 查询
function search() {
  query.value.pageNum = 1
  getList()
}
// 重置
function reset() {
  query.value = {
    pageNum: 1,
    pageSzie: 10
  }
  getList()
}
// 全选需删除的数据
function handleSelectionChange(rows) {
  selectedRows.value = rows.map(it => it.noticeId)
}
// 新增、编辑公告
function handleNotice(row={}) {
  router.push({
    path: '/webSettings/handleNotice',
    query: {
      type: 'notice',
      id: row.noticeId||''
    }
  })
}

getList()
</script>

<style scoped>
.pagination-container {
  padding: 0 !important;
}
</style>