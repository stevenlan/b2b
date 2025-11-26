<script setup>
import {ref, reactive, defineComponent} from "vue";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {getToken} from "@/utils/auth.js";
import {getPaymentDetail, upPayment} from "@/api/payment/index.js";
const {proxy} = getCurrentInstance()
import { ElMessage } from 'element-plus'
const visible = ref({
  detail: false
})
const paymentChannel = ref('')

function show (row) {
  paymentChannel.value = row.name
  form.value = {}
  getPaymentInfo(row.id)
  visible.value.detail = true
}

const loading = ref(false)
const rules = ref({
  logo: [{required: true, message: "请上传网站logo", trigger: "blur"}],
  clientId: [{required: true, message: "请输入正确的clientId", trigger: "blur"}],
  secret: [{required: true, message: "请输入正确的secret", trigger: "blur"}],
  endpointSecret: [{required: true, message: "请输入正确的endpointSecret", trigger: "blur"}],
})
const form = ref({});

// 上传类目图片
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
// 上传配置
const uploadConfig = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})
// 上传图片
function handleImageSuccess(response) {
  form.value.logo = response.data.url
}
function beforeImgUpload(rawFile) {
  if(rawFile.size / 1024 / 1024 > 2) {
    proxy.$modal.msgError('类目图片大小不能超过2M!')
    return false;
  }
}
defineExpose({
  show
})
// 获取当前支付配置详情
function getPaymentInfo(id) {
  loading.value = true
  getPaymentDetail(id).then(res => {
    form.value = res.data
    loading.value = false
  })
}

// 提交表单
const formRef = ref()
const submitLoading = ref(false)
function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      upPayment(form.value).then(res => {
        ElMessage.success('修改成功')
        submitLoading.value = false
        cancel()
        emit('rest')
      }).catch(() => {
        ElMessage.success('修改失败')
        submitLoading.value = false
        cancel()
        emit('rest')
      })
    }
  })
}
const emit = defineEmits(['rest'])
// 取消
function cancel () {
  visible.value.detail = false
}
</script>

<template>
  <el-dialog
      v-model="visible.detail"
      :close-on-click-modal="false"
      :title="paymentChannel === 'paypal' ? 'Paypal配置' : 'Stripe配置'"
      width="35%"
  >
      <div class="describe" v-if="paymentChannel === 'paypal'">
        <h4>密钥绑定步骤</h4>
        <p>1、在 PayPal 创建 APP创建 PayPal APP</p>
        <p>2、进入PayPal APP 页面点击已创建 APP name 进入对应 APP 编辑页</p>
        <p>3、点击 Live 按钮，获取到 Client ID 及 Secret</p>
      </div>
    <div v-loading="loading">
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
      >
        <el-form-item label="logo" prop="logo">
          <el-upload
              accept="'.png, .jpeg, .png, .jpg, .webp'"
              :headers="uploadConfig.headers"
              :action="uploadImgUrl"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImgUpload"
              class="img-uploader"
          >
            <img v-if="form.logo" :src="form.logo" class="img" />
            <el-icon v-else class="img-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Client ID" prop="clientId">
          <el-input type="text" style="width: 360px" v-model="form.clientId" maxlength="150" />
        </el-form-item>
        <el-form-item label="Secret" prop="secret">
          <el-input type="text" style="width: 360px" v-model="form.secret" maxlength="150" />
        </el-form-item>
        <el-form-item v-if="paymentChannel !== 'paypal'" label="endpointSecret" prop="endpointSecret">
          <el-input type="text" style="width: 360px" v-model="form.endpointSecret" maxlength="150" />
        </el-form-item>
      </el-form>
    </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" v-loading="submitLoading" @click="submit">确 定</el-button>
        </span>
      </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.describe {
  margin-bottom: 20px;
  background: #F5F6FA;
  padding: 16px;
  h4 {
    color: #333333;
    font-size: 16px;
    margin: 0 0 16px 0;
  }
  p {
    font-size: 12px;
    color: #8C8C8C;
    margin-bottom: 8px;
  }
}
.img-uploader {
  .img {
    width: 80px;
    height: 80px;
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
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
  }
}
</style>
