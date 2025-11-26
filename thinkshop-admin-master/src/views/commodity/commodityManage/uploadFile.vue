<template>
  <div>
    <el-upload
      accept="'.png, .jpeg, .jpg, .webp'"
      :headers="uploadSetting.headers"
      :action="uploadImgUrl"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeImgUpload"
      class="img-uploader"
    >
      <img v-if="modelValue" :src="modelValue" class="img" />
      <el-icon v-else class="img-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const {modelValue} = toRefs(props)
const emit = defineEmits(['update:modelValue'])
// 上传类目图片
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})

function handleImageSuccess(res) {
  if(res.code===200) {
    emit('update:modelValue', res.data.url)
  }
}
function beforeImgUpload(rawFile) {
  if(rawFile.size / 1024 / 1024 > 1) {
    proxy.$modal.msgError('类目图片大小不能超过1M!')
    return false;
  }
}
</script>

<style scoped lang='scss'>
.img-uploader {
  .img {
    width: 58px;
    height: 58px;
    display: block;
  }
  :deep(.el-upload) {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: .2s;
    &:hover {
      border-color: #409eff;
    }
  }
  .el-icon.img-uploader-icon {
    font-size: 14px;
    color: #8c939d;
    width: 58px;
    height: 58px;
    text-align: center;
  }
}
</style>