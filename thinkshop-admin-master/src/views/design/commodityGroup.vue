<template>
  <div>
    <el-button type="primary" class="mb20" @click="add()">新增</el-button>
    <el-table
      :data="dataList"
    >
      <el-table-column label="序号" type="index" width="80"/>
      <el-table-column label="分组" prop="name"/>
      <el-table-column label="展示状态">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button link type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogInfo.visible"
      :title="dialogInfo.title"
      width="500px"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :footer="null"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
      >
        <el-form-item label="请选择分组" prop="groupId">
          <el-select filterable placeholder="请选择分组" v-model="form.groupId">
            <el-option v-for="it in groupList" :label="it.name" :value="it.groupId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {queryGroup} from "@/api/commodity"
import {queryDesignGroup, addDesignGroup, delDesignGroup, updateDesignGroup} from '@/api/design'

const {proxy} = getCurrentInstance()

const dataList = ref([])
const dialogInfo = ref({})
const groupList = ref([])
const loading = ref(false)
const form = ref({})
const formRef = ref(null)
const rules = ref({
  groupId: [{required: true, message: '请选择分组'}]
})

function add() {
  dialogInfo.value = {
    visible: true,
    title: '新增分组展示'
  }
}
function close() {
  dialogInfo.value = {}
  form.value = {}
}
function del(row) {
  proxy.$modal.confirm('确认要删除该分组吗?').then(function () {
    return delDesignGroup(row.id)
  }).then(() => {
    initData()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(function () {

  })
}
// 商品分组数据
function getGroupList() {
  queryGroup({pageNum: 1, pageSize: 99}).then(res => {
    const {rows} = res
    groupList.value = rows
  })
}
// 首页商品组合数据
function initData() {
  loading.value = true
  queryDesignGroup().then(r => {
    loading.value = false
    dataList.value = r.rows
  })
}
// 新增商品组合
function submitForm() {
  formRef.value.validate(valid => {
    if(valid) {
      addDesignGroup(form.value).then(r => {
        close()
        initData()
        proxy.$modal.msgSuccess('新增成功')
      })
    }
  })
}
// 修改分组状态
function changeStatus(row) {
  updateDesignGroup(row).then(r => {
    initData()
  })
}

initData()
getGroupList()
</script>

<style scoped>
:deep(.el-dialog__footer) {
  text-align: center;
}
</style>