<template>
  <div class="c-footer">
    <el-form
      :model="form"
      label-width="120px"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="页脚LOGO" prop="pageBottomUrl">
        <upload-file
          v-model="form.pageBottomUrl"
          tip="推荐上传尺寸：30*20"
        />
      </el-form-item>
      <el-form-item label="版权备案号" prop="copyright">
        <el-input class="w500" placeholder="请输入版本备案号" v-model="form.copyright"/>
      </el-form-item>
      <el-form-item label="关于我们" prop="phone">
        <div class="r-form-item">
          <p>电话：</p>
          <el-input class="w500" placeholder="请输入电话" v-model="form.phone"/>
        </div>
      </el-form-item>
      <el-form-item label=" " prop="email">
        <div class="r-form-item">
          <p>EMAIL：</p>
          <el-input class="w500" placeholder="请输入EMAIL" v-model="form.email"/>
        </div>
      </el-form-item>
      <el-form-item label=" " prop="address">
        <div class="r-form-item">
          <p>联系地址：</p>
          <el-input class="w500" placeholder="请输入联系地址" v-model="form.address"/>
        </div>
      </el-form-item>
      <el-form-item label="客服二维码">
        <el-upload
          list-type="picture-card"
          accept="'.png, .jpeg, .jpg, .webp'"
          :limit="2"
          :action="uploadUrl"
          :data="uploadSetting.data"
          :headers="uploadSetting.headers"
          :file-list="form.pageBottomQrCodeUrls"
          :on-preview="previewFile"
          :on-success="uploadSuccess"
          :on-remove="removeFile"
          :before-upload="beforeUpload"
          :class="form.pageBottomQrCodeUrls?.length === 2?'hide_box':''"
        >
          <div class="upload-icon-cell">
            <img :src="imgUploadIcon">
            <p>上传照片</p>
          </div>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="其他" prop="other">
        <el-select class="w500" placeholder="清选择" v-model="form.other">
          <el-option
            v-for="it in optList"
            :key="it.value"
            :label="it.label"
            :value="it.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" " prop="privacyPolicy">
        <editor v-model="form.privacyPolicy" :min-height="300"/>
      </el-form-item> -->
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import UploadFile from './uploadFile.vue'
import { getToken } from "@/utils/auth"
import imgUploadIcon from '@/assets/images/img_upload.png'
import {queryFooter, addHeader, updateHeader} from '@/api/design'

const {proxy} = getCurrentInstance()

const form = ref({
  pageBottomQrCodeUrls: []
})
const formRef = ref(null)
const optList = ref([
  {label: '法律条款', value: 1},
  {label: '隐私政策', value: 2},
  {label: '法律声明', value: 3},
  {label: '付款', value: 4},
  {label: '配送', value: 5},
  {label: '换货及退货', value: 6},
  {label: '关于订单', value: 7},
  {label: '产品维护', value: 8},
  {label: '产品维修', value: 9},
])
const rules = ref({
  pageBottomUrl: [{required: true, message: '请上传页脚LOGO'}]
})
// 上传文件
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
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
  form.value.pageBottomQrCodeUrls.push({
    imgPath: url,
    url,
    uid: file.uid
  })
}
function removeFile(file) {
  const { uid } = file
  const urlIndex = form.value.pageBottomQrCodeUrls.findIndex(x => x.uid === uid)
  if(urlIndex > -1) form.value.pageBottomQrCodeUrls.splice(urlIndex, 1)
}
function previewFile() {}
// 格式商品视频和主图
function deFormatFile(file) {
  if(file&&file?.length) {
    return file.map(it => {
      return {
        url: it,
        imgPath: it
      }
    })
  }
  return []
}
// 查询页脚配置
function initData() {
  queryFooter().then(r => {
    const rData = r.data
    rData.pageBottomQrCodeUrls = deFormatFile(rData.pageBottomQrCodeUrls)
    if(r.data) form.value = rData
  })
}
// 新增、编辑页眉配置
function submitForm() {
  const {id, pageBottomQrCodeUrls} = form.value
  const api = id?updateHeader:addHeader
  formRef.value.validate(valid => {
    if(valid) {
      api({
        ...form.value,
        pageBottomQrCodeUrls: pageBottomQrCodeUrls.map(it => it.url)
      }).then(r => {
        if(!id) initData()
        proxy.$modal.msgSuccess('保存成功')
      })
    }
  })
}

initData()
</script>

<style scoped lang="scss">
.c-footer {
  .w500 {
    width: 500px;
  }
  .r-form-item {
    p {
      color: #666666;
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
}
.hide_box :deep(.el-upload--picture-card) {
  display: none;
}
</style>