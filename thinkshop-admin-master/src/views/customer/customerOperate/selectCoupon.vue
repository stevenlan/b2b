<template>
  <el-dialog
    title="选择优惠券"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    v-model="visible"
    center
    width="40%"
    class="s-dialog"
  >
    <el-table
      :data="tableObj.rows"
      ref="multipleTableRef"
      row-key="id"
      max-height="550"
      @select="handleSelect"
      @select-all="handleSelectAll"
      v-loading="loading"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
      />
      <el-table-column type="index" width="60" align="center" label="序号"/>
      <el-table-column label="优惠券名称" prop="couponName"/>
      <el-table-column label="类型">
        <template #default="scope">
          {{`${scope.row.couponType===1?'满减':'折扣'}券`}}
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="remark"/>
      <el-table-column label="库存（张）">
        <template #default="scope">
          {{ scope.row.number - scope.row.receivedNumber}}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableObj.total>0"
      :total="tableObj.total"
      v-model:page="query.pageNum"
      v-model:limit="query.pageSize"
      @pagination="getList"
      class="mb24"
    />
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { getCoupon} from "@/api/coupon"
import {deepClone} from '@/utils'

const props = defineProps({
  initCoupon: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['confirmSelect'])

const visible = ref(false)
const loading = ref(false)
const query = ref({
  pageNam: 1,
  pageSize: 10,
  status: 1
})
const tableObj = ref({
  total: 0,
  rows: []
})
const multipleTableRef = ref(null)
const selectedGoupon = ref([])

// 选择优惠券
const handleSelect = (e, row) => {
  if (selectedGoupon.value.some(it => it.id===row.id)) {
    // 删除
    selectedGoupon.value.splice(selectedGoupon.value.findIndex(it => it.id === row.id), 1)
  } else {
    // 新增
    selectedGoupon.value.push(row)
  }
}
// 全选优惠券
const handleSelectAll = (e) => {
  if (e.length > 0) {
    e.forEach(item => {
      if (!selectedGoupon.value.some(it => it.id===item.id)) {
        selectedGoupon.value.push(item)
      }
    });
  } else {
    // 当前页全部删除
    tableObj.rows.forEach((row) => {
      const index = selectedGoupon.value.findIndex(it => it.id === row.id);
      selectedGoupon.value.splice(index, 1);
    });
  }
}
function confirm() {
  if(selectedGoupon.value.length) {
    emits('confirmSelect', selectedGoupon.value)
    close()
  } else {
    proxy.$modal.msgError('请选择优惠券')
  }
}
function close() {
  visible.value = false
  selectedGoupon.value = []
  multipleTableRef.value?.clearSelection()
  tableObj.value = {
    total: 0,
    rows: []
  }
}
function open() {
  visible.value = true
  query.value.pageNum = 1
  getList()
}
function getList() {
  selectedGoupon.value = deepClone(props.initCoupon)
  loading.value = true
  getCoupon(query.value).then(r => {
    const {total, rows} = r
    loading.value = false
    tableObj.value = {total, rows}
    nextTick(() => {
      if(selectedGoupon.value?.length) {
        for (let i = 0; i < rows.length; i++) {
          if (selectedGoupon.value.some(it => it.id === rows[i].id)) {
            const row = rows[i];
            multipleTableRef.value.toggleRowSelection(row, true);
          }
        }
      }
    })
  })
}

defineExpose({open})
</script>

<style scoped lang="scss">

</style>