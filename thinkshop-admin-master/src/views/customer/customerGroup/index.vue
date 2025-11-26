<template>
  <div class="p24">
    <el-row :gutter="10" class="mb16">
      <el-col :span="1.5">
        <el-button
            type="primary"
            icon="Plus"
            @click="()=> {handleAdd()}"
        >新建人群</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    <!-- 人群条件搜索 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryRef"
      class="search-form"
    >
      <el-form-item label="人群名称" prop="name">
        <el-input placeholder="请输入人群名称" v-model="queryParams.name"/>
      </el-form-item>
      <el-form-item label="客户数量">
        <el-input-number :controls="false" class="w60" :precision="0" :max="queryParams.userCountMax || Infinity" v-model="queryParams.userCountMin"/>
        <span class="mlr5">至</span>
        <el-input-number :controls="false" class="w60" :precision="0" :min="queryParams.userCountMin" v-model="queryParams.userCountMax"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table  v-loading="loading" :data="tableOb.rows" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="100" align="center" label="序号"/>
      <el-table-column align="center" label="人群名称" prop="name" key="" width="200"/>
      <el-table-column align="center" label="人群定义" prop="" key="">
        <template #default="scope">
          <p>{{ formatRules(scope.row.ruleInfo) }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="人群数量" prop="userCount" key="" width="100"/>
      <el-table-column align="center" label="操作" prop="" key="" width="280">
        <template #default="scope">
          <el-button type="primary" link @click="handleGroup(scope.row, 'edit')">编辑</el-button>
          <el-button type="primary" link @click="handleGroup(scope.row, 'member')">查看客户</el-button>
          <el-button type="primary" link @click="handleGroup(scope.row, 'operation')">运营</el-button>
          <el-button type="danger" link @click="handleGroup(scope.row, 'del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="tableOb.total"
      v-show="tableOb.total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <MeberList ref="memberRef"/>
  </div>
</template>

<script setup>
import {queryGroup, delGroup, queryTag} from '@/api/customer'
import MeberList from './memberList.vue';
import {formatRules} from '../common'

const { proxy } = getCurrentInstance();
const router = useRouter()

const defaultParams = {
  name: '',
  userCountMin: null,
  userCountMax: null,
  pageNum: 1,
  pageSize: 10
}
const queryParams = ref({...defaultParams})
const loading = ref(false)
const queryRef = ref(null)
const tableOb = reactive({
  total: 1,
  rows: []
})
const groupRef = ref(null)
const memberRef  = ref(null)
const selectedGroup = ref([])
const tagList = ref([])

// 获取分组数据
function getList() {
  loading.value = true
  queryGroup(queryParams.value).then(r => {
    loading.value = false
    const {rows, total} = r
    Object.assign(tableOb, {total, rows})
  })
}
// 查询
function handleQuery() {
  Object.assign(queryParams.value, {
    pageNum: 1,
    pageSize: 10
  })
  getList()
}
// 重置
function resetQuery() {
  queryParams.value = {...defaultParams}
  proxy.resetForm("queryRef")
  getList()
}
function handleAdd() {
  router.push({path: '/customerGroup/handle'  })
}
// 编辑、人群客户、删除人群
function handleGroup(row, type) {
  if(type==='edit') router.push({path: '/customerGroup/handle', query: {groupId: row.id}})
  if(type==='del') handleDelete(row)
  if(type==='member') memberRef.value.open(row)
  if(type==='operation') router.push(`/customer/operate?groupId=${row.id}`)
}
function handleDelete(row) {
  const ids = row?row.id:selectedGroup.value.join(',')
  if(!ids) return proxy.$modal.msgWarning('请选择要删除的人群')
  proxy.$modal.confirm('确认删除该人群吗？', '删除提示')
  .then(() => {return delGroup({ids})})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  })
}
function handleSelectionChange(rows) {
  selectedGroup.value = rows.map(it => it.id)
}
// 获取条件字典、标签
function initData() {
  queryTag({pageNum: 1, pageSize: 99}).then(r => {
    tagList.value = r.rows
  })
}

initData()
getList()
</script>

<style lang="scss" scoped>
.w60 {
  width: 100px;
}
.mlr5 {
  margin: 0 5px;
  color: #666666;
}
</style>