<template>
  <el-dialog
    title="人群名称"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    v-model="visible"
    class="s-dialog-table s-dialog"
  >
    <el-table
      :data="tableOb.rows"
      v-loading="loading"
    >
      <el-table-column label="name" prop="">
        <template #default="scope">
          {{ scope.row.firstName || ''}}
          {{ scope.row.lastName || ''}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email"/>
      <el-table-column label="消费次数" prop="orderCount"/>
      <el-table-column label="累计消费金额" prop="totalOrderAmount"/>
      <el-table-column label="上次消费时间" prop="lastConsumeTime" width="180">
        <template #default="scope">
          {{parseTime(scope.row.lastConsumeTime)}}
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createTime" width="180">
        <template #default="scope">
          {{parseTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column label="客户标签" prop="tags">
        <template #default="scope">
          {{scope.row.tags?.length?scope.row.tags.join(','):''}}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="tableOb.total"
      v-show="tableOb.total > 0"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      @pagination="getList"
    />
    </el-dialog>
</template>

<script setup>
import {groupMembers} from '@/api/customer'

const visible = ref(false)
const groupId = ref('')
const defaultPage = {
  pageNum: 1,
  pageSize: 10
}
const page = ref({...defaultPage})
const tableOb = reactive({
  total: 0,
  rows: []
})
const loading = ref(false)

function close() {
  groupId.value = ''
  visible.value = false
}
// 获取列表数据
function getList() {
  loading.value = true
  groupMembers(groupId.value, page.value).then(r => {
    loading.value = false
    const {total, rows} = r
    Object.assign(tableOb, {total, rows})
  })
}
function open(row) {
  groupId.value = row.id
  visible.value = true
  getList()
}

defineExpose({open})
</script>

<style lang="scss" scoped>

</style>