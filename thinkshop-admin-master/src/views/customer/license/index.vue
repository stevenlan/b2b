<template>
  <div class="p24">
    <el-button type="primary" class="mb20" @click="() => {openLicenses()}">新增类目</el-button>
    <el-table
      :data="tableObj.rows"
      v-loading="loading"
      row-key="categoryId"
      :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="公司名称" prop="company"/>
      <el-table-column label="国家" prop="country"/>
      <el-table-column label="州" prop="state"/>
      <el-table-column label="城市" prop="city"/>
      <el-table-column label="状态" prop="status"/>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleTableItem(scope.row, 'pending')">审核</el-button>
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
    <openLicense ref="addRef" @refresh="getList"/>
  </div>
</template>

<script setup>
import openLicense from "./pending.vue"
import {queryLicense, queryLicenseInfo} from '@/api/customer'

const { proxy } = getCurrentInstance();
const tableObj = reactive({
  total: 0,
  rows: []
})
const loading = ref(false)
const addRef = ref(null)
const query = ref({
  pageNum: 1,
  pageSize:10
})

function getList() {
  loading.value = true
  queryLicense().then(res=> {
    const {rows, total} = res
    loading.value = false
    Object.assign(tableObj, {
      rows,
      total
    })
  })
}
const handleTableItem = (row, type) => {
  if(type==='edit') openLicense(row)
}
function openLicenses(info={}) {
  addRef.value.open(info)
}

getList()
</script>

<style lang="scss" scoped>
</style>
