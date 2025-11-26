<template>
  <el-dialog
    title="选择分组"
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
      <el-table-column type="index" width="100" align="center" label="序号"/>
      <el-table-column label="人群名称" prop="name"/>
      <el-table-column align="center" label="人群定义" prop="" key="">
        <template #default="scope">
          <p>{{ formatRules(scope.row.ruleInfo) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="人群数量" prop="userCount" width="100"/>
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
  import {queryGroup} from '@/api/customer'
  import {formatRules} from '../common'
  import {deepClone} from '@/utils'

  const {proxy} = getCurrentInstance()
  const emits = defineEmits(['confirmSelect'])

  const props = defineProps({
    initGroup:  {
      type: Array,
      default: () => []
    }
  })
  const visible = ref(false)
  const query = ref({
    pageNum: 1,
    pageSize: 10
  })
  const tableObj = ref({
    total: 0,
    rows: []
  })
  const loading = ref(false)
  const multipleTableRef = ref(null)
  const selectedGroup = ref([])

  // 选择分组
  const handleSelect = (e, row) => {
    if (selectedGroup.value.some(it => it.id===row.id)) {
      // 删除
      selectedGroup.value.splice(selectedGroup.value.findIndex(it => it.id === row.id), 1)
    } else {
      // 新增
      selectedGroup.value.push(row)
    }
  }
  // 全选分组
  const handleSelectAll = (e) => {
    if (e.length > 0) {
      e.forEach(item => {
        if (!selectedGroup.value.some(it => it.id===item.id)) {
          selectedGroup.value.push(item)
        }
      });
    } else {
      // 当前页全部删除
      tableObj.rows.forEach((row) => {
        const index = selectedGroup.value.findIndex(it => it.id === row.id);
        selectedGroup.value.splice(index, 1);
      });
    }
  }
  function confirm() {
    if(selectedGroup.value.length) {
      emits('confirmSelect', selectedGroup.value)
      close()
    } else {
      proxy.$modal.msgError('请选择分组')
    }
  }
  function close() {
    visible.value = false
    selectedGroup.value = []
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
    selectedGroup.value = deepClone(props.initGroup)
    loading.value = true
    queryGroup(query.value).then(r => {
      const {total, rows} = r
      loading.value = false
      tableObj.value = {total, rows}
      nextTick(() => {
        if(selectedGroup.value?.length) {
          for (let i = 0; i < rows.length; i++) {
            if (selectedGroup.value.some(it => it.id === rows[i].id)) {
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