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
    <el-form
      ref="formRef"
      :rules="rules"
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="公司名称" prop="company">
        <el-input
          class="w400"
          v-model="formData.company"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input
          class="w400"
          v-model="formData.country"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="州/地区" prop="state">
        <el-input
          class="w400"
          v-model="formData.state"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input
          class="w400"
          v-model="formData.city"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="邮编" prop="zip">
        <el-input
          class="w400"
          v-model="formData.zip"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="地址1" prop="address1">
        <el-input
          class="w400"
          v-model="formData.address1"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="地址2" prop="address2">
        <el-input
          class="w400"
          v-model="formData.address2"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="hearUs" prop="hearUs">
        <el-input-textarea
          class="w400"
          v-model="formData.hearUs"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="businessTime" prop="businessTime">
        <el-input-textarea
          class="w400"
          v-model="formData.businessTime"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="locations" prop="locations">
        <el-input-textarea
          class="w400"
          v-model="formData.locations"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="monthHardware" prop="monthHardware">
        <el-input-textarea
          class="w400"
          v-model="formData.monthHardware"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="monthLiquid" prop="monthLiquid">
        <el-input-textarea
          class="w400"
          v-model="formData.monthLiquid"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="contactMethod" prop="contactMethod">
        <el-input-textarea
          class="w400"
          v-model="formData.contactMethod"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="许可证到期时间" prop="dueDate">
        <el-input
          class="w400"
          v-model="formData.dueDate"
          aria-readonly="true"
        />
      </el-form-item>
      <el-form-item label="许可文件" prop="licenseFile">
        <div v-if="formData.licenseFile && formData.status != 1">
          <a v-if="formData.licenseFile.indexOf('pdf') > -1 || formData.licenseFile.indexOf('PDF') > -1" style="font-size: 20px;margin-left: 20px;" :href="formData.licenseFile">
            <CloudDownloadOutlined style="margin-right: 10px"/>file</a>
          <a-image v-else :width="200" :src="formData.licenseFile"/>
        </div>
      </el-form-item>
      <el-form-item label="审核意见" prop="notes">
        <el-input-textarea
          class="w400"
          v-model="formData.notes"
          :controls="false"
          placeholder="请输入审核意见"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="approveForm(formRef)">通过</el-button>
      <el-button type="primary" @click="refuseForm(formRef)">拒绝</el-button>
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
  firstLevel.value = []
  secondLevel.value = []
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
function open(info) {
  const {id} = info
  if(id) {
    formData.id = id
    queryLicenseInfo(id).then(res => {
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