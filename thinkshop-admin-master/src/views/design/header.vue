<template>
  <div class="c-header">
    <el-form
      :model="form"
      :rules="rules"
      label-width="120px"
      ref="formRef"
    >
      <el-form-item label="页眉LOGO" prop="pageTopUrl">
        <UploadFile
          v-model="form.pageTopUrl"
          tip="推荐上传尺寸：30*20"
        />
      </el-form-item>
      <el-form-item label="客服链接" prop="customerServiceUrl">
        <el-input v-model="form.customerServiceUrl"/>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import UploadFile from './uploadFile.vue'
import {queryHeader, addHeader, updateHeader} from '@/api/design'

const {proxy} = getCurrentInstance()

const form = ref({})
const rules = ref({
  pageTopUrl: [{required: true, message: '请上传页眉LOGO'}],
  customerServiceUrl: [{required: true, message: '请输入客服链接'}]
})
const formRef = ref(null)
// 查询页眉配置
function initData() {
  queryHeader().then(r => {
    if(r.data) form.value = r.data
  })
}
// 新增、编辑页眉配置
function submitForm() {
  const {id} = form.value
  const api = id?updateHeader:addHeader
  formRef.value.validate(valid => {
    if(valid) {
      api(form.value).then(r => {
        if(!id) initData()
        proxy.$modal.msgSuccess('保存成功')
      })
    }
  })
}

initData()
</script>

<style>
.c-header {
  width: 500px;
}
</style>