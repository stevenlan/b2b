<template>
  <el-dialog
    title="关联商品"
    @close="close"
    width="60%"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="f-box">
      <div class="f-item">当前类目： </div>
      <div class="f-item">
        <el-button type="danger" plain @click="batchUnBind">取消关联</el-button>
        <el-button type="primary" @click="addProduct">新增</el-button>
      </div>
    </div>
    <el-table
      :data="tableOb.rows"
      v-loading="loading"
      max-height="550"
      row-key="productId"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
      />
      <el-table-column prop="productCode" label="商品id" width="200"/>
      <el-table-column label="商品图片">
        <template #default="scope">
          <img
            height="40"
            width="40"
            :src="scope.row.image"
            alt
            srcset
          />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="productName" width="120"/>
      <el-table-column
        prop="section"
        label="售价区间"
        show-overflow-tooltip
        width="120"
      >
        <template #default="scope">
          {{`${scope.row.skuType===1?'':scope.row.minPrice+'~'}${scope.row.maxPrice}`}}
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock"/>
      <el-table-column label="销量" prop="sales"/>
      <el-table-column prop="createTime" label="创建时间" width="200">
        <template #default="scope">
          {{parseTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="" fixed="right" width="120">
        <template #default="scope">
          <el-button type="danger" text @click="unBind(scope.row.productId)">取消关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableOb.total > 0"
      :total="tableOb.total"
      v-model:page="query.pageNum"
      v-model:limit="query.pageSize"
      @pagination="getList"
    />
    <ProductComp
      ref='productRef'
      @confirmSelect="confirmSelect"
      :isRelation="1"
      title="手动添加商品"
    />
  </el-dialog>
</template>

<script setup>
import ProductComp from '../commodityGroup/productComp.vue'
import {queryProduct, bindProduct, unbindProduct} from '@/api/commodity'

const emits = defineEmits()
const {proxy} = getCurrentInstance()

const visible = ref(false)
const info = ref({})
const defaultQuery = {
  pageNum: 1,
  pageSize: 10
}
const query = reactive({...defaultQuery})
const defaultTableOb = {
  total: 0,
  rows: []
}
const tableOb = reactive(JSON.parse(JSON.stringify(defaultTableOb)))
const loading = ref(false)
const  productRef = ref(null)
const selectedIds = ref([])

function addProduct() {
  productRef.value.open()
}
// 关联商品
function confirmSelect(ids) {
  bindProduct({
    categoryId: info.value.categoryId,
    productIds: ids
  }).then(res => {
    query.pageNum = 1
    getList()
  })
}
//关联商品列表
function getList() {
  loading.value = true
  queryProduct({...query, categoryId: info.value.categoryId}).then(
    r => {
      const {rows, total} = r
      loading.value = false
      Object.assign(tableOb, {total, rows})
    }
  )
}
// 挑选要取消关联商品
const handleSelect = (e, row) => {
  if (selectedIds.value.includes(row.productId)) {
    // 删除
    selectedIds.value.splice(selectedIds.value.findIndex(it => it === row.productId), 1)
  } else {
    // 新增
    selectedIds.value.push(row.productId)
  }
}
// 全选商品
const handleSelectAll = (e) => {
  if (e.length > 0) {
    e.forEach(item => {
      if (!selectedIds.value.includes(item.productId)) {
        selectedIds.value.push(item.productId)
      }
    });
  } else {
    // 当前页全部删除
    productOb.rows.forEach((row) => {
      const index = selectedIds.value.findIndex(it => it === row.productId);
      selectedIds.value.splice(index, 1);
    });
  }
}
// 取消关联
function unBind(id) {
  const ids = id?[id]:selectedIds.value
  unbindProduct({productIds: ids.join(',')}).then(r => {
    getList()
  })
}
// 批量取消关联
function batchUnBind() {
  if(selectedIds.value.length) {
    unBind()
  } else {
    proxy.$modal.msgError("请选择需要取消关联的商品")
  }
}
function open(row) {
  visible.value = true
  info.value = row
  getList()
}
function close() {
  visible.value =false
  info.value = {}
  Object.assign(query, defaultQuery)
  Object.assign(tableOb, defaultTableOb)
  emits('refresh')
}

defineExpose({open})
</script>

<style lang='scss'>
.f-box {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>