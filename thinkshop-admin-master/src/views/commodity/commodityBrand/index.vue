<template>
  <div class="p24">
    <el-button type="primary" class="mb20" @click="() => {addBrand()}">新增品牌</el-button>
    <el-table
      :data="tableObj.rows"
      v-loading="loading"
      row-key="categoryId"
      :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="品牌名称" prop="name"/>
      <el-table-column label="品牌图">
        <template #default="scope">
          <img
            height="40"
            width="40"
            :src="scope.row.brandImage"
            alt
            srcset
          />
        </template>
      </el-table-column>
      <el-table-column label="首页精选" prop="selected"/>
      <el-table-column label="关联商品数" prop="relationCount"/>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleTableItem(scope.row, 'edit')">编辑</el-button>
          <el-button type="danger" link @click="handleTableItem(scope.row, 'del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddBrand ref="addRef" @refresh="getList"/>
  </div>
</template>

<script setup>
import AddBrand from "./addBrand.vue"
//import Products from "./products.vue"
import {queryBrand, delBrand} from '@/api/commodity'

const { proxy } = getCurrentInstance();
const tableObj = reactive({
  total: 0,
  rows: []
})
const loading = ref(false)
const addRef = ref(null)

function getList() {
  loading.value = true
  queryBrand().then(res=> {
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
      return delBrand({brandIds: row.id})
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功")
      getList()
    })
    .catch(() => {});
  }
  if(type==='edit') addBrand(row)
}
function addBrand(info={}) {
  addRef.value.open(info)
}

getList()
</script>

<style lang="scss" scoped>
</style>
