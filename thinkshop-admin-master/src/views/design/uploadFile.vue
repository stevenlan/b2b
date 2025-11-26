<template>
  <div>
    <el-upload
      :accept="accept"
      :headers="uploadSetting.headers"
      :action="uploadImgUrl"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeImgUpload"
      class="img-uploader"
    >
      <img v-if="modelValue&&isImg" :src="modelValue" class="img" />
      <video controls="controls" loop="loop" width="100%" height="100%" v-if="modelValue&&!isImg">
        <source :src="modelValue" type="video/mp4" />
      </video>
      <el-icon v-if="!modelValue" class="img-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <p v-if="tip" class="tip">{{tip}}</p>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";

const {proxy} = getCurrentInstance()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '.png, .jpeg, .jpg, .webp'
  },
  tip: {
    type: String,
    default: ''
  }
})

const {modelValue, tip, accept} = toRefs(props)
const emit = defineEmits(['update:modelValue'])
// 上传类目图片
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")

const isImg = computed(() => {
  return accept.value.includes('jpeg')
})

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
    proxy.$modal.msgError('图片大小不能超过1M!')
    return false;
  }
  return true
}
</script>

<style scoped lang='scss'>
.img-uploader {
  .img {
    width: 110px;
    height: 110px;
    display: block;
  }
  video {
    width: 110px;
    height: 110px;
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
    width: 110px;
    height: 110px;
    text-align: center;
  }
}
.tip {
  color: #999999;
}
</style>