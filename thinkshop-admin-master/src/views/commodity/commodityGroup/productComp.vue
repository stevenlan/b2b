<template>
  <el-dialog
    :title="props.title"
    v-model="visible"
    width="55%"
    :close-on-click-model="false"
    :close-on-press-escape="false"
    @close="close"
    center
    class="s-dialog s-dialog-table"
  >
    <el-form
      :inline="true"
      :model="query"
      ref="formRef"
      class="search-form"
    >
      <el-form-item label="商品id" prop="productCode">
        <el-input
          maxlength="20"
          v-model="query.productCode"
          placeholder="请输入商品id"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          maxlenght="20"
          v-model="query.productName"
          placeholder="请输入商品名称"
        />
      </el-form-item>
      <el-form-item label="商品状态" prop="isShow">
        <el-select v-model="query.isShow">
          <el-option :value="1" label="已上架"/>
          <el-option :value="0" label="已下架"/>
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableObj.rows"
      max-height="550"
      row-key="productId"
      ref="multipleTableRef"
      v-loading="loading"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
        v-if="multiple"
      />
      <el-table-column
        v-else
        width="55"
      >
        <template #default="scope">
          <el-radio-group v-model="selectSingle.productId" @change="() => {selectSingle = {...scope.row}}">
            <el-radio :label="scope.row.productId">{{''}}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="220" align="center">
        <template #default="scope">
          <img height="40" width="40" :src="scope.row.image" alt srcset />
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="商品名称"
        width="220"
        align="center"
      />
      <el-table-column
        prop="stock"
        label="库存"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="priceRange"
        label="价格"
        show-overflow-tooltip
      />
    </el-table>
    <pagination
        v-show="tableObj.total > 0"
        :total="tableObj.total"
        v-model:page="query.pageNum"
        v-model:limit="query.pageSize"
        @pagination="getList"
        class="pro-page"
    />
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {queryProduct} from '@/api/commodity'

const {proxy} = getCurrentInstance()

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
  // 反显已选择过的商品
  selectedProductIds: {
    type: Array,
    default: () => []
  },
  // 是否关联类目
  isRelation: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: '选择商品'
  },
  selectedProduct: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['confirmSelect'])
const visible = ref(false)
const defaultQuery = {
  productCode: '',
  productName: '',
  isShow: '',
  pageNum: 1,
  pageSize: 10
}
const query = reactive({...defaultQuery})
const loading = ref(false)
const defaultTableObj = reactive({
  total: 0,
  rows: []
})
const tableObj = reactive({...defaultTableObj})
const selectIds = ref([])
const multipleTableRef = ref(null)
const formRef = ref(null)
const selectSingle = ref({})

function getList() {
  const {selectedProductIds, multiple, selectedProduct} = props
  loading.value = true
  selectIds.value = [...selectedProductIds]
  selectSingle.value = {...selectedProduct}
  queryProduct(query).then(res => {
    const {total, rows} = res
    loading.value = false
    Object.assign(tableObj, {
      total,
      rows
    })
    if(multiple) {
      nextTick(() => {
        if(selectedProductIds.length) {
          for (let i = 0; i < tableObj.rows.length; i++) {
            if (selectedProductIds.includes(tableObj.rows[i].productId)) {
              const row = tableObj.rows[i];
              multipleTableRef.value.toggleRowSelection(row, true);
            }
          }
        }
      })
    }
  })
}
// 挑选商品
const handleSelect = (e, row) => {
  if (selectIds.value.includes(row.productId)) {
    // 删除
    selectIds.value.splice(selectIds.value.findIndex(it => it === row.productId), 1)
  } else {
    // 新增
    selectIds.value.push(row.productId)
  }
}
// 全选商品
const handleSelectAll = (e) => {
  if (e.length > 0) {
    e.forEach(item => {
      if (!selectIds.value.includes(item.productId)) {
        selectIds.value.push(item.productId)
      }
    });
  } else {
    // 当前页全部删除
    tableObj.rows.forEach((row) => {
      const index = selectIds.value.findIndex(it => it === row.productId);
      selectIds.value.splice(index, 1);
    });
  }
}
function open() {
  visible.value = true
  getList()
}
function close() {
  visible.value = false
  formRef.value.resetFields()
  selectIds.value = []
  selectSingle.value = {}
  multipleTableRef.value?.clearSelection()
  Object.assign(tableObj, defaultTableObj)
}
function confirm() {
  if(selectIds.value.length || selectSingle.value.productId) {
    emits('confirmSelect', props.multiple?selectIds.value:selectSingle.value)
    close()
  }
  if(!selectSingle.value.productId && !selectIds.value.length && visible.value ) {
    proxy.$modal.msgError('请选择商品')
  }
}

const search = () => {
  query.pageNum=1
  getList()
}
function reset() {
  formRef.value.resetFields()
  search()
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>

</style>