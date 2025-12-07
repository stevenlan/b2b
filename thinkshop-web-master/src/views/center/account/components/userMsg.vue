<template>
  <div class="register-page">
    <div class="register-container">
      <a-form ref="subform" autocomplete="off" :model="form" layout="vertical">
        <section class="form-section">
          <h2 class="section-title">{{$t('login.accountDetails')}}</h2>
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.referral" placeholder="Recommendation Code" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input :value="form.accType>-1?accountTypeOptions[form.accType].label:''" placeholder="Account Type" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.firstName" placeholder="First name" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.lastName" placeholder="Last name" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.email" placeholder="Email" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.phone" placeholder="Telephone" disabled/>
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="form-section">
          <h2 class="section-title">{{$t('login.password')}}</h2>
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item>
                <div class="password-box">
                  <a-input v-model:value="form.password" type="password" :disabled="true" :bordered="true" class="e-input" />
                  <span @click="openPasswordModal">{{$t('myAccount.alter')}}</span>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="form-section">
          <h2 class="section-title">{{$t('login.addressDetails')}}</h2>
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.company" placeholder="Company" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12" style="visibility: hidden">
              <a-form-item :label="$t('login.company')">
                <c-input />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.address1" placeholder="Address 1" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.address2" placeholder="Address 2" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.city" placeholder="City" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input v-model:value="form.zip" placeholder="Post Code" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input :value="form.country" placeholder="Post Code" disabled/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item>
                <c-input :value="form.state" placeholder="Post Code" disabled/>
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section>
          <div style="">
            <h2 class="section-title" style="display: flex">Files
              <div style="margin-left: 20px">
                <div v-if="form.status == 0" style="color: #67C23A">Passed</div>
                <div v-else-if="form.status == 1" style="color: #F56C6C">Rejection</div>
                <div v-else>Pending review</div>
              </div>
            </h2>
          </div>
          <a-row align="center">
            <a-col v-if="form.status == 1" :xs="24" :md="24">
              <a-form-item label="Reasons for rejection">
                {{form.notes}}
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="24">
              <a-form-item v-bind="validateInfos.dueDate" label="Business License Expiration Date">
                <a-date-picker v-model:value="form.dueDate" style="width: 400px"  size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="24">
              <a-form-item v-bind="validateInfos.licenseFile" label="Upload your Business License / Tax Certificate">
                <div v-if="form.licenseFile && !isExpired && form.status != 1">
                  <a v-if="form.licenseFile.indexOf('pdf') > -1 || form.licenseFile.indexOf('PDF') > -1" style="font-size: 20px;margin-left: 20px;" :href="form.licenseFile">
                    <CloudDownloadOutlined style="margin-right: 10px"/>file</a>
                  <a-image v-else :width="200" :src="form.licenseFile"/>
<!--                  <a-button type="primary" danger ghost @click="changeListen">Change</a-button>-->
                </div>
                <a-upload-dragger
                    v-else
                    name="file"
                    :headers="requestHeaders"
                    :multiple="false"
                    :show-upload-list="true"
                    :max-count="1"
                    :accept="'image/*, application/pdf'"
                    :action="baseUrl + '/file/upload'"
                    :before-upload="beforeUpload"
                    list-type="picture-card"
                    @preview="handlePreview"
                    @change="handleUpload"
                >
                  <p class="ant-upload-drag-icon">
                    <CloudUploadOutlined />
                  </p>
                  <p class="ant-upload-text">UPLOAD FILE</p>
                </a-upload-dragger>
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <a-row align="center" style="margin-top: 16px;">
          <a-button type="text" class="submit-btn" block @click="submitAuth" align="center">
            submit
          </a-button>
        </a-row>
      </a-form>
    </div>
    <ForgetPassword :email="form.email" v-model="open"/>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup>
import ForgetPassword from "@/views/center/account/components/restPassword.vue";
import {
  CloudUploadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons-vue';
import useUserStore from "@/store/modules/user.js";

const baseUrl = ref(import.meta.env.VITE_APP_BASE_API)
const useUser = useUserStore()
// 上传图片列表
const requestHeaders = {
  Authorization: 'Bearer ' + useUser.token
}
// 修改密码
const open = ref(false)
function openPasswordModal() {
  open.value = true
}
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import {getInfo} from "@/api/login.js";
import { useRouter } from 'vue-router'
import {Form, message} from 'ant-design-vue'
import { getAuthFileInfo, updAuthFileInfo } from '@/api/license'
import dayjs from 'dayjs'
const emit = defineEmits(['switchToLogin'])


const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const router = useRouter()
const { proxy } = getCurrentInstance()

const useForm = Form.useForm
const defaultForm = {
  referral: '',
  accType: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '************',
  confirmPassword: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  country: undefined,
  state: undefined,
  hearUs: undefined,
  businessTime: '',
  locations: '',
  monthHardware: '',
  monthLiquid: '',
  contactMethod: undefined,
  licenseFile: '',
  dueDate: undefined
}

const form = ref({ ...defaultForm })

const accountTypeOptions = [
  { label: 'Retailer', value: 0 },
  { label: 'Distributor', value: 1 },
  { label: 'Service Provider', value: 2 },
  { label: 'Other', value: 3 },
]

const { validate, validateInfos,validateFields } = useForm(
  form,
  reactive({
    licenseFile: [{ required: true, message: 'Please upload license file' }],
    dueDate: [
        { required: true, message: 'Please select expiration date' },
      {
        validator: (_, value) => {
          const today = new Date().getTime()
          // 处理传入的日期
          let expiry = form.value.dueDate
          if (typeof expiry === 'string') {
            // 如果字符串是ISO格式（如"2023-12-31"），直接转换为Date，注意时区问题
            // 注意：如果字符串是其他格式，可能需要解析
            expiry = new Date(expiry).getTime()
          }else{
            expiry = new Date(dayjs(expiry)).getTime()
          }
          if (today < expiry) {
            return Promise.resolve()
          }
          return Promise.reject(new Error('The file has expired.'))
        },
      },
    ],
  })
)

const loading = ref(false)

const fileList = ref([])

function handleUpload(info) {
  fileList.value = info.fileList
  const { file } = info;

  // 1. 仅在上传成功时处理
  if (file.status === 'done') {
    // 2. 确保接口返回成功 (根据你的接口结构)
    if (file.response && file.response.code === 200) {
      const imageUrl = file.response.data.url;
      // 3. 获取线上图片URL
      form.value.licenseFile = imageUrl
      fileList.value = [file]
      // - 更新图片预览
      const targetFile = fileList.value.find(item => item.uid === file.uid);
      if (targetFile) {
        // 设置 url 和 thumbUrl，两者通常设置为同一个地址
        targetFile.url = imageUrl;
        targetFile.thumbUrl = imageUrl; // thumbUrl 用于列表缩略图
      }
    } else {
      // 处理接口返回错误的情况
      console.error('上传接口返回错误：', file.response);
    }
  } else if (file.status === 'error') {
    // 处理上传失败的情况
    console.error(`${file.name} 文件上传失败`);
  }
}

function beforeUpload(file) {
  const isAllowed = file.type.includes('image') || file.type === 'application/pdf'
  if (!isAllowed) message.error('Only images or PDF are allowed')
  return isAllowed
}

function submitAuth() {
  validate().then(() => {
    let query = Object.assign({},form.value)
    query.dueDate = query.dueDate ? dayjs(query.dueDate).format('YYYY-MM-DD') : '',
    updAuthFileInfo(query).then(() => {
      message.success('Submit success')
      fetchAuthInfo()
    })
  })
}

// 计算属性：是否过期
const isExpired = computed(() => {
  // 获取当前日期（只比较日期，所以将时间设置为0）
  const today = new Date().getTime()

  // 处理传入的日期
  let expiry = form.value.dueDate
  if (typeof expiry === 'string') {
    // 如果字符串是ISO格式（如"2023-12-31"），直接转换为Date，注意时区问题
    // 注意：如果字符串是其他格式，可能需要解析
    expiry = new Date(expiry).getTime()
  }else{
    expiry = new Date(dayjs(expiry)).getTime()
  }
  // 比较：如果过期日期早于今天，则过期
  return expiry < today
})

function changeListen(){
  form.value.licenseFile = ''
}

function fetchAuthInfo() {
  getAuthFileInfo({}).then((res) => {
    const data = res?.data || {}
    form.value = {
      ...defaultForm,
      ...data,
      dueDate: data.dueDate ? dayjs(data.dueDate) : undefined
    }
  })
}
function getUser() {
  getInfo().then((res) => {
    form.value.referral = res.data?.referral ||''
    form.value.firstName = res.data?.firstName ||''
    form.value.lastName = res.data?.lastName ||''
    form.value.email = res.data?.email ||''
    form.value.phone = res.data?.phonenumber ||''
    form.value.accType = res.data?.accType ||''
  }).catch((err) => {
  })
}

onMounted(() => {
  fetchAuthInfo()
  getUser()
})
</script>

<style lang="scss" scoped>
.register-page {
  display: flex;
  justify-content: left;
}

.register-container {
  width: 100%;
  max-width: 824px;
  padding-bottom: 80px;
}

.page-title {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 12px;
}

.page-subtitle {
  text-align: center;
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 40px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24px;
}

.item-label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: #1d1d1f;
}

.item-tip {
  font-size: 12px;
  font-weight: 400;
  color: #8c8c8c;
  line-height: 22px;
}

.label-required {
  font-weight: 500;
  color: #1d1d1f;
}

.required {
  margin-left: 4px;
  color: #f5222d;
}

.code-btn {
  color: #1d1d1f;
  font-weight: 500;
}

.agreement-item {
  margin-top: 8px;
}

.link {
  color: #1c3c8c;
  margin-left: 6px;
  cursor: pointer;
  text-decoration: underline;
}

.submit-btn {
  margin-top: 16px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: #100;
  border-color: #100;
  color: #FFFFFF;
  width: 460px;
}

.bottom-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #4b4b4d;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-input),
:deep(.ant-input-affix-wrapper),
:deep(.ant-select-selector) {
  border-radius: 8px;
  min-height: 44px;
}

:deep(.ant-input-textarea-show-count .ant-input),
:deep(.ant-input-textarea .ant-input) {
  min-height: auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .register-container {
    padding: 32px 20px;
  }

  .page-title {
    font-size: 26px;
  }

  .section-title {
    font-size: 18px;
  }
}
:deep(.ant-input-password){
  overflow: hidden;
  padding-top: 0;
}
.password-box {
  position: relative;
  width: 400px;
  span {
    position: absolute;
    right: 10px;
    top: 10px;
    font-weight: 500;
    text-decoration: underline;
    cursor: pointer;
    color: #262626;
  }
}
</style>
