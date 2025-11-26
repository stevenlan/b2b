<template>
  <el-dialog
    v-model="visible"
    title="新增自评"
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
      <el-form-item label="商品" prop="productName">
        <el-input
          class="w60"
          placeholder="请选择商品"
          v-model="form.productName"
          readonly
        >
          <template #append>
            <el-button type="primary" @click="selectPro">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="规格" prop="skuId">
        <el-select
          class="w60"
          placeholder="请选择规格"
          v-model="form.skuId"
        >
          <el-option
            v-for="it in skuList"
            :key="it.skuId"
            :label="formatSku(it.skuDetail)"
            :value="it.skuId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="commentUser">
        <el-input
          class="w60"
          v-model="form.commentUser"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label="评分" prop="score">
        <el-rate allow-half v-model="form.score"/>
      </el-form-item>
      <el-form-item label="评价内容" prop="comment" class="comment-box">
        <el-input
          v-model="form.comment"
          maxlength="500"
          placeholder="请输入评价内容"
          :show-word-limit="true"
          type="textarea"
        />
        <el-upload
          list-type="picture-card"
          accept="'.png, .jpeg, .jpg, .webp'"
          :limit="9"
          :action="uploadUrl"
          :data="uploadSetting.data"
          :headers="uploadSetting.headers"
          :file-list="form.imageUrls"
          :on-preview="previewFile"
          :on-success="uploadSuccess"
          :on-remove="removeFile"
          :before-upload="beforeUpload"
          :class="form.imageUrls?.length === 9?'hide_box':''"
        >
          <div class="upload-icon-cell">
            <img :src="imgUploadIcon">
            <p>上传照片</p>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="评价时间" prop="commentTime">
        <el-date-picker
          v-model="form.commentTime"
          type="datetime"
          placeholder="请选择评价时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close" plain>取消</el-button>
      <el-button type="primary" @click="saveForm(formRef)">保存</el-button>
    </template>
    <productComp ref="productRef" :multiple="false" :selectedProduct="selectedProduct" @confirmSelect="confirmSelectPro"/>
  </el-dialog>
</template>

<script setup>
import { getToken } from "@/utils/auth"
import imgUploadIcon from '@/assets/images/img_upload.png'
import productComp from "../commodityGroup/productComp.vue"
import {productInfo, addComment} from '@/api/commodity'

const {proxy} = getCurrentInstance()
const emits = defineEmits('reload')

// 上传文件
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})
const productRef = ref(null)
const visible = ref(false)
const form = ref({
  imageUrls: []
})
const formRef = ref(null)
const rules = ref({
  productName: [{required: true, message: '请选择商品'}],
  skuId: [{required: true, message: '请选择规格'}],
  commentUser: [{required: true, message: '请填写邮箱'}],
  score: [{required: true, message: '请选择评分'}],
  // comment: [{required: true, message: '请填写评论'}],
  commentTime: [{required: true, message: '请选择评论时间'}],
})
const selectedProduct = ref({})
const skuList = ref([])

function selectPro() {
  productRef.value.open()
}
// 选择商品时，需重置上一个商品规格
function confirmSelectPro(item) {
  const {productId, productName} = item
  Object.assign(form.value, {
    productId,
    productName
  })
  skuList.value = []
  form.value.skuId = ''
  selectedProduct.value = item
  productInfo(productId).then(r => {
    const {skus} = r.data
    if(skus?.length) skuList.value = skus
  })
}
// 格式规格值
function formatSku(info) {
  let str = ''
  Object.entries(info).reduce((pre, [key, value]) => {
    str=`${pre?pre+',':''}${key}:${value}`
    return str
  }, str)
  return str
}
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
  form.value.imageUrls.push({
    imgPath: url,
    url,
    uid: file.uid
  })
}
function removeFile(file) {
  const { uid } = file
  const urlIndex = form.value.imageUrls.findIndex(x => x.uid === uid)
  if(urlIndex > -1) form.value.imageUrls.splice(urlIndex, 1)
}
function previewFile() {}
function close() {
  visible.value = false
  form.value = {imageUrls: []}
  formRef.value.resetFields()
}
function saveForm(formEl) {
  if(!formEl) return
  console.log(form.value ,';form')
  formEl.validate((valid, err)=>{
    if(valid) {
      const {imageUrls} = form.value
      addComment({
        ...form.value,
        imageUrls: imageUrls.map(it => it.url)
      }).then(res => {
        close()
        emits('reload')
        proxy.$modal.msgSuccess(`自评成功`)
      })
    }
  })
}
function open() {
  visible.value = true
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