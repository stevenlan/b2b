<template>
  <div>
    <el-button class="mb20" type="primary" @click="handleItem()">新增</el-button>
    <el-table
      :data="dataList"
      v-loading="loading"
    >
      <el-table-column label="序号" width="80" type="index"/>
      <el-table-column label="图片" prop="">
        <template #default="scope">
          <img
            height="80"
            width="80"
            :src="scope.row.resourceUrl"
            alt
            srcset
          />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"/>
      <el-table-column label="简介" prop="introduction"/>
      <el-table-column label="链接" prop="redirectUrl"/>
      <el-table-column label="类型" prop="">
        <template #default="scope">
          {{scope.row.type===1?'左图右文':'左文右图'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="handleItem(scope.row)">编辑</el-button>
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
        ref="formRef"
      >
        <el-form-item label="图片" prop="resourceUrl">
          <UploadFile
            v-model="form.resourceUrl"
            tip="推荐上传尺寸为592*394px"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            v-model="form.introduction"
            maxlength="200"
            placeholder="请输入简介"
            show-word-limit
            type="textarea"
            resize="vertical"
            :autosize="{ minRows: 2, maxRows: 8 }"
          />
        </el-form-item>
        <el-form-item label="链接" prop="redirectUrl">
          <el-input v-model="form.redirectUrl" placeholder="请输入链接"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select placeholder="请选择" v-model="form.type">
            <el-option :value="1" label="左图右文"/>
            <el-option :value="2" label="左文右图"/>
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
import UploadFile from './uploadFile.vue'
import {queryTextVideo, addTextVideo, delTextVideo, updateTextVideo} from '@/api/design'

const {proxy} = getCurrentInstance()

const dataList = ref([])
const loading = ref(false)
const form = ref({})
const rules = ref({
  resourceUrl: [{required: true, message: '请上传图片'}],
  title: [{required: true, message: '请输入标题'}],
  introduction: [{required: true, message: '请输入简介'}],
  redirectUrl: [{required: true, message: '请输入链接'}],
  type: [{required: true, message: '请选择类型'}],
})
const formRef = ref(null)
const dialogInfo = ref({})

function handleItem(item) {
  if(item) form.value = {...item}
  dialogInfo.value = {
    visible: true,
    title: `${item?"修改":"新增"}图文`
  }
}
function  del(row) {
  proxy.$modal.confirm('确认删除该图文吗？').then(() => {
    return delTextVideo(row.id)
  })
  .then(() => {
    initData()
    proxy.$modal.msgSuccess("删除成功")
  })
  .catch(() => {})
}
function close() {
  dialogInfo.value = {}
  formRef.value.resetFields()
  form.value = {}
}
// 拉取图文列表数据
function initData() {
  loading.value = true
  queryTextVideo(1).then(r => {
    dataList.value = r.rows
    loading.value = false
  })
}
// 新增修改图文
function submitForm() {
  const {id} = form.value
  const api = id?updateTextVideo:addTextVideo
  const text = id?'修改':'新增'
  formRef.value.validate(valid => {
    if(valid) {
      api(form.value).then(r => {
        proxy.$modal.msgSuccess(`${text}成功`)
        initData()
        close()
      })
    }
  })
}
// 修改图文状态
function changeStatus(row) {
  updateTextVideo(row).then(r => {
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