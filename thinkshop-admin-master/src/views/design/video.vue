<template>
  <div class="c-video">
    <el-form
      :model="form"
      :rules="rules"
      label-width="120"
      ref="formRef"
    >
      <el-form-item label="视频" prop="resourceUrl">
        <upload-file
          accept=".mp4, .webm"
          v-model="form.resourceUrl"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input class="w500" placeholder="请输入标题" v-model="form.title"/>
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
          class="w500"
        />
      </el-form-item>
      <el-form-item label="链接" prop="redirectUrl">
        <el-input class="w500" placeholder="请输入链接" v-model="form.redirectUrl"/>
      </el-form-item>
      <el-form-item label=" " prop="">
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import UploadFile from './uploadFile.vue'
import {queryTextVideo, addTextVideo, delTextVideo, updateTextVideo} from '@/api/design'


const form = ref({})
const formRef = ref(null)
const rules = ref({
  resourceUrl: [{required: true, message: '请上传视频'}],
  title: [{required: true, message: '请输入标题'}],
  introduction: [{required: true, message: '请输入简介'}],
  redirectUrl: [{required: true, message: '请输入链接'}],
})


function close() {
  dialogInfo.value = {}
  formRef.value.resetFields()
  form.value = {}
}
// 拉取图文列表数据
function initData() {
  queryTextVideo(0).then(r => {
    const {total, rows} = r
    if(total) form.value = rows[0]
  })
}
// 新增修改图文
function submitForm() {
  const {id} = form.value
  const api = id?updateTextVideo:addTextVideo
  const text = id?'修改':'新增'
  formRef.value.validate(valid => {
    if(valid) {
      api({...form.value, type: 0}).then(r => {
        proxy.$modal.msgSuccess(`${text}成功`)
        initData()
        close()
      })
    }
  })
}

initData()
</script>

<style scoped lang="scss">
.c-video {
  .w500 {
    width: 500px;
  }
}
</style>