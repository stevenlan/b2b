<template>
  <el-dialog
    v-model="visible"
    :title="`审核用户许可`"
    :close-on-click-model="false"
    :close-on-press-escape="false"
    width="700"
    center
    @close="close"
    class="s-dialog"
  >
    <div class="p24">
      <el-row class="mb20">
        <el-col>
          <p><span class="label">公司名称：</span> {{info.company}}</p>
        </el-col>
      </el-row>
      <el-row class="mb20">
        <el-col :span="6">
          <p><span class="label">国家：</span> {{info.country}}</p>
        </el-col>
        <el-col :span="6">
          <p><span class="label">州/地区：</span> {{info.state}}</p>
        </el-col>
        <el-col :span="6">
          <p><span class="label">城市：</span> {{info.city}}</p>
        </el-col>
        <el-col :span="6">
          <p><span class="label">邮编：</span> {{info.zip}}</p>
        </el-col>
      </el-row>
      <el-row class="mb20">
        <el-col :span="24">
          <p><span class="label">地址：</span> {{info.address1}}
            <span v-if="info.address2"> {{info.address2}}</span>
          </p>
        </el-col>
      </el-row>
      <el-row class="mb20">
        <el-col :span="24">
          <p><span class="label">是如何了解我们的？：</span> {{info.hearUs}}</p>
          <p><span class="label">经营了多久？：</span> {{info.businessTime}}</p>
          <p><span class="label">有多少门店？：</span> {{info.locations}}</p>
          <p><span class="label">每月硬件销售额：</span> {{info.monthHardware}}</p>
          <p><span class="label">每月液体销售额：</span> {{info.monthLiquid}}</p>
          <p><span class="label">偏好的联系方式是？：</span> {{info.contactMethod}}</p>
        </el-col>
      </el-row>
      <el-row class="mb20">
        <el-col :span="24">
          <p><span class="label">许可证到期时间：</span> {{info.dueDate}}</p>
        </el-col>
      </el-row>
      <el-row v-if="info.licenseFile" class="mb20">
        <el-col :span="24">
          <p>
            <a v-if="info.licenseFile.indexOf('pdf') > -1 || info.licenseFile.indexOf('PDF') > -1" style="font-size: 20px;margin-left: 20px;" :href="info.licenseFile">
              <el-button type="warning">查看许可文件</el-button></a>
            <a v-else :href="info.licenseFile">
              <img :src="info.licenseFile" class="img" />
            </a>
          </p>
        </el-col>
      </el-row>
    </div>
    <el-form
      ref="formRef"
      :rules="rules"
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="审核反馈" prop="notes">
        <el-input
          type="textarea"
          class="w500"
          v-model="formData.notes"
          :controls="false"
          placeholder="请输入审核反馈"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="approveForm(formRef)">通过</el-button>
      <el-button type="danger" @click="refuseForm(formRef)">拒绝</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { queryLicenseInfo, approveLicense, refuseLicense} from '@/api/customer'
import { getToken } from "@/utils/auth";
import { computed } from 'vue';

const emits = defineEmits(['refresh'])
const {proxy} = getCurrentInstance()
const visible = ref(false)
const defaultForm = {
  notes: '',
  id: ''
}
const info = ref({})
const formData = reactive({...defaultForm})
const formRef = ref(null)
const rules = ref({
  notes: [
    {required: true, message: '请填写审核意见', trigger: 'blur'}
  ]
})
// 上传类目图片
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})
// 层级类目数据
function close() {
  Object.assign(formData, defaultForm)
  formRef.value.resetFields()
  visible.value = false
}
async function approveForm(formEl) {
  if(!formEl) return
  await formEl.validate((valid) => {
    if(valid) {
      approveLicense(formData).then(res => {
        close()
        emits('refresh')
        proxy.$modal.msgSuccess(`审核成功`)
      })
    }
  })
}
async function refuseForm(formEl) {
  if(!formEl) return
  await formEl.validate((valid) => {
    if(valid) {
      refuseLicense(formData).then(res => {
        close()
        emits('refresh')
        proxy.$modal.msgSuccess(`审核成功`)
      })
    }
  })
}
function handleImageSuccess(response) {
  formData.pictureUrl = response.data.url
}
function beforeImgUpload(rawFile) {
  if(rawFile.size / 1024 / 1024 > 2) {
    proxy.$modal.msgError('类目图片大小不能超过2M!')
    return false;
  }
}
function open(rd) {
  const {id} = rd
  if(id) {
    formData.id = id
    queryLicenseInfo(id).then(res => {
      info.value = res.data
      Object.keys(formData).forEach(key => {
        formData[key] = res.data[key]
      })
    })
  }
  visible.value=true
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.w400 {
  width: 400px;
}
.w500 {
  width: 500px;
}
.w250 {
  width: 250px;
}
:deep(.el-dialog__body) {
  padding: 0%;
}
.img-uploader {
  .img {
    width: 80px;
    height: 90px;
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
    height: 90px;
    text-align: center;
  }
}
</style>