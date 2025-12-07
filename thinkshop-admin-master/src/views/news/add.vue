<template>
  <el-dialog
    v-model="visible"
    title="新增"
    :close-on-click-model="false"
    :close-on-press-escape="false"
    width="650"
    center
    @close="close"
    class="s-dialog"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          class="w60"
          v-model="form.title"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item label="简介" prop="mainPoint" class="comment-box">
        <el-input
          v-model="form.mainPoint"
          maxlength="500"
          placeholder="请输入内容"
          :show-word-limit="true"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload
            list-type="picture-card"
            accept="'.png, .jpeg, .jpg, .webp'"
            :limit="1"
            :action="uploadUrl"
            :data="uploadSetting.data"
            :headers="uploadSetting.headers"
            :file-list="fileList"
            :on-preview="previewFile"
            :on-success="uploadSuccess"
            :on-remove="removeFile"
            :before-upload="beforeUpload"
        >
          <div class="upload-icon-cell">
            <img :src="imgUploadIcon">
            <p>上传封面</p>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="saveForm(formRef)">保存</el-button>
    </template>
    <editors v-model="form.content"/>
  </el-dialog>
</template>

<script setup>

import { getToken } from "@/utils/auth"
import imgUploadIcon from '@/assets/images/img_upload.png'
import {addNews,updateNews} from '@/api/system/news'
import Editors from "@/views/news/editors.vue";
const {proxy} = getCurrentInstance()
const emits = defineEmits('reload')

// 上传文件
const fileList = ref([])
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})
const visible = ref(false)
const form = ref({
  cover: '',
  mainPoint: '',
  title: '',
  content: '123222',
})
const formRef = ref(null)
const rules = ref({
  cover: [{required: true, message: '请上传封面'}],
  mainPoint: [{required: true, message: '请填写简介'}],
  title: [{required: true, message: '请填写标题'}]
})
function beforeUpload(file) {
  const {size, type} = file
  if(type.indexOf('image') > -1&&size / 1024 / 1024 > 1) {
    proxy.$modal.msgWarning('图片大小不能超过1M!')
    return false
  }
  return true
}
function uploadSuccess(res, file) {
  const {code, data={}} = res
  if(code!==200) {
    return
  }
  const url = data.url
  form.value.cover=url
}
function removeFile(file) {
  form.value.cover = ''
}
function previewFile() {}
function close() {
  visible.value = false
  fileList.value = []
  form.value = {
    cover: '',
    mainPoint: '',
    title: '',
    content: '',
  }
  formRef.value.resetFields()
}
function saveForm(formEl) {
  if(!formEl) return
  formEl.validate((valid, err)=>{
    if(valid) {
      const api = editType =='add'?addNews:updateNews
      api(form.value).then(res => {
        close()
        emits('reload')
        proxy.$modal.msgSuccess(editType =='add'?`新增成功`:'修改成功')
      })
    }
  })
}
const editType = ref('add')
function open(type,res) {
  editType.value = type
  visible.value = true
  if(type == 'edit'){
    const {data} = res
    form.value.id = data.id
    form.value.cover = data.cover
    form.value.mainPoint = data.mainPoint
    form.value.title = data.title
    form.value.content = data.content
    fileList.value =  [{name: '1.jpg', url: data.cover}]
  }
}

defineExpose({open})
</script>

<style lang="scss" scoped>
.w60 {
  // width: 60% !important;
}
:deep(.el-form-item__content) {
  .el-input-group__append {
    .el-button {
      color: #FFFFFF;
      background: #2662F6;
    }
  }
}
.hide_box :deep(.el-upload--picture-card) {
  display: none;
}
:deep(.comment-box) {
  .el-form-item__content {
    flex-direction: column;
    align-items: start;
    row-gap: 10px;
  }
}
:deep(.el-upload-list--picture-card) {
  .el-upload-list__item, .el-upload--picture-card {
    height: 80px;
    width: 80px;
    background: #F8F8F8;
    border-radius: 2px 2px 2px 2px;
    border: none;
    &:hover {
      color: initial;
    }
  }
  .upload-icon-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;
    img {
      height: 32px;
      width: 32px;
    }
    p {
      font-size: 12px;
      line-height: initial;
    }
  }
}
</style>
