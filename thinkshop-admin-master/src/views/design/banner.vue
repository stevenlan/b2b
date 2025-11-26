<template>
  <div>
    <el-button type="primary" class="mb20" @click="handleBanner()">新增</el-button>
    <el-table
      :data="dataList"
      v-loading="loading"
    >
      <el-table-column type="index" width="80" label="序号"/>
      <el-table-column label="banner" prop="banner">
        <template #default="scope">
          <img
            height="80"
            width="80"
            :src="scope.row.imageUrl"
            alt
            srcset
          />
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" prop="redirectUrl"/>
      <el-table-column label="状态" prop="state">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="handleBanner(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="del(scope.row)">删除</el-button>
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
        :rules="rules"
        ref="dialogRef"
      >
        <el-form-item label="banner图" prop="imageUrl">
          <UploadFile
            v-model="form.imageUrl"
            tip="推荐上传尺寸为1200*540"
          />
        </el-form-item>
        <el-form-item label="跳转链接" prop="redirectUrl">
          <el-input v-model="form.redirectUrl"/>
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
import UploadFile from './uploadFile.vue'
import {queryBanner, addBanner, delBanner, updateBanner} from '@/api/design'

const {proxy} = getCurrentInstance()

const dataList = ref([])
const loading = ref(false)
const dialogInfo = ref({})
const form = ref({})
const rules = ref({
  imageUrl: [{required: true, message: '请上传图片'}],
  redirectUrl: [{required: true, message: '请输入链接'}],
})
const dialogRef = ref(null)

function handleBanner(item) {
  if(item) {
    form.value = {...item}
  }
  dialogInfo.value = {
    visible: true,
    title: `${item?'新增':'编辑'}banner`
  }
}
function del(row) {
  proxy.$modal.confirm('确认要删除该banner吗?').then(function () {
    return delBanner(row.id)
  }).then(() => {
    initData()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(function () {

  })
}
function close() {
  dialogInfo.value = {}
  dialogRef.value.resetFields()
  form.value = {}
}
// banner列表数据
function initData() {
  loading.value = true
  queryBanner({pageNum: 1, pageSize: 50}).then(r => {
    loading.value = false
    dataList.value = r.rows
  })
}
// 新增修改banner
function submitForm() {
  const {id} = form.value
  const api = id?updateBanner:addBanner
  const text = id?'修改':'新增'
  dialogRef.value.validate(valid => {
    if(valid) {
      api(form.value).then(r => {
        proxy.$modal.msgSuccess(`${text}成功`)
        initData()
        close()
      })
    }
  })
}
// 修改banner状态
function changeStatus(row) {
  updateBanner(row).then(r => {
    initData()
  })
}
initData()
</script>

<style scoped>
:deep(.el-dialog__footer) {
  text-align: center;
}
</style>