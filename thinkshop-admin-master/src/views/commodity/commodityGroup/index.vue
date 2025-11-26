<template>
  <div class="p-group">
    <el-button type="primary" class="mb16" @click="()=>{addGroup()}">新建分组</el-button>
    <el-form
      :inline="true"
      :model="query"
      class="search-form"
    >
      <el-form-item label="分组名称">
        <el-input v-model="query.name" placeholder="请输入分组名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData.list"
      :header-cell-style="{
        background: '#EEF3FF',
        color: '#333333'
      }"
      tooltip-effect="dark"
      style="width: 100%"
      class="dataTable"
      v-loading="loading"
    >
      <el-table-column type="index" width="80" label="序号"/>
      <el-table-column prop="name" label="分组名称"/>
      <el-table-column prop="remark" label="分组描述"/>
      <el-table-column prop="relationCount" label="商品数量"/>
      <el-table-column prop="updateTime" label="修改时间"/>
      <el-table-column prop="groupName" label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="handleTableItem(scope.row, 'edit')">编辑</el-button>
          <el-button type="danger" link @click="handleTableItem(scope.row, 'del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="tableData.total > 0"
        :total="tableData.total"
        v-model:page="query.pageNum"
        v-model:limit="query.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup>
import {queryGroup, delGroup} from "@/api/commodity"

const router = useRouter()
const {proxy} = getCurrentInstance()

const defaultQuery = {
  name: '',
  pageNum: 1,
  pageSize: 10
}
const loading = ref(false)
const query = reactive({...defaultQuery})
const tableData = reactive({
  list: [],
  total: 0
})

function search () {
  query.pageNum = 1
  getList()
}
function getList() {
  loading.value = true
  queryGroup(query).then(res => {
    const {rows, total} = res
    loading.value = false
    Object.assign(tableData, {
      list: rows,
      total
    })
  })
}
function reset() {
  Object.assign(query, defaultQuery)
  getList()
}
function addGroup(info={}) {
  let query = {}
  if(info.groupId) query.groupId = info.groupId
  router.push({path: '/commodityGroup/handle', query})
}
const handleTableItem = (row, type) => {
  if(type==='edit') addGroup(row)
  if(type==='del') {
    proxy.$modal.confirm('确认要删除"' + row.name + '"分组吗?')
    .then(function () {
      return delGroup({groupIds: row.groupId})
    })
    .then(() => {
        proxy.$modal.msgSuccess("删除成功")
        getList()
    })
    .catch(() => {});
  }
}

getList()
</script>

<style lang="scss" scoped>
.p-group {
  padding: 20px;
  margin-top: 20px;
}
</style>
