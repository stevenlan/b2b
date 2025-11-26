<template>
  <div class="p24">
    <el-button type="primary" class="mb20" @click="() => {addCategory()}">新增类目</el-button>
    <el-table
      :data="tableObj.rows"
      v-loading="loading"
      row-key="categoryId"
      :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="类目名称" prop="name"/>
      <el-table-column label="类目图">
        <template #default="scope">
          <img
            height="40"
            width="40"
            :src="scope.row.pictureUrl"
            alt
            srcset
          />
        </template>
      </el-table-column>
      <el-table-column label="级别" prop="level"/>
      <el-table-column label="权重" prop="weight"/>
      <el-table-column label="关联商品数" prop="relationCount"/>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleTableItem(scope.row, 'products')">关联商品</el-button>
          <el-button type="primary" link @click="handleTableItem(scope.row, 'edit')">编辑</el-button>
          <el-button type="danger" link @click="handleTableItem(scope.row, 'del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddCategory ref="addRef" @refresh="getList"/>
    <Products ref="productsRef" @refresh="getList"/>
  </div>
</template>

<script setup>
import AddCategory from "./addCategory.vue"
import Products from "./products.vue"
import {queryCategory, delCategory} from '@/api/commodity'

const { proxy } = getCurrentInstance();
const tableObj = reactive({
  total: 0,
  rows: []
})
const loading = ref(false)
const addRef = ref(null)
const productsRef = ref(null)

function getList() {
  loading.value = true
  queryCategory().then(res=> {
    const {rows, total} = res
    loading.value = false
    Object.assign(tableObj, {
      rows,
      total
    })
  })
}
const handleTableItem = (row, type) => {
  if(type==='del') {
    proxy.$modal.confirm('删除该类目将会同步删除该类目所有下级类目，且被删除分类将与产品解除关联', '删除提示').then(() => {
      return delCategory({categoryIds: row.categoryId})
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功")
      getList()
    })
    .catch(() => {});
  }
  if(type==='edit') addCategory(row)
  if(type==='products') productsRef.value.open(row)
}
function addCategory(info={}) {
  addRef.value.open(info)
}

getList()
</script>

<style lang="scss" scoped>
</style>
