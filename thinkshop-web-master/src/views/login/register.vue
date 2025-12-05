<template>
  <div class="register-page">
    <div class="register-container">
      <h1 class="page-title">{{$t('login.signUpTitle')}}</h1>
      <p class="page-subtitle">{{$t('login.signUpSubtitle')}}</p>
      <a-form autocomplete="off" :model="form" layout="vertical">
        <section class="form-section">
          <h2 class="section-title">{{$t('login.accountDetails')}}</h2>
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.recommendationCode">
                <template #label>
                  <div class="item-label" style="flex-direction: row;">
                    <div>{{$t('login.recommendationCode')}}</div>
                    <div class="item-tip">{{$t('login.recommendationTip')}}</div>
                  </div>
                </template>
                <c-input v-model:value="form.recommendationCode" placeholder="Recommendation Code" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.accountType">
                <template #label>
                  <span class="label-required">{{$t('login.accountType')}}<span class="required">*</span></span>
                </template>
                <a-select
                  v-model:value="form.accountType"
                  placeholder="Account Type"
                  :options="accountTypeOptions"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.firstName">
                <template #label>
                  <span class="label-required">{{$t('login.firstName')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.firstName" placeholder="First name" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.lastName">
                <template #label>
                  <span class="label-required">{{$t('login.lastName')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.lastName" placeholder="Last name" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.email">
                <template #label>
                  <span class="label-required">{{$t('login.email')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.email" placeholder="Email" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.telephone">
                <template #label>
                  <span class="label-required">{{$t('login.telephone')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.telephone" placeholder="Telephone" />
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="form-section">
          <h2 class="section-title">{{$t('login.password')}}</h2>
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.password">
                <template #label>
                  <span class="label-required">{{$t('login.password')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.password" placeholder="Password" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.confirmPassword">
                <template #label>
                  <span class="label-required">{{$t('login.confirmPassword')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.confirmPassword" placeholder="Password Confirm" />
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="form-section">
          <h2 class="section-title">{{$t('login.addressDetails') || 'Address'}}</h2>
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('login.company')">
                <c-input v-model:value="form.company" placeholder="Company" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.address1">
                <template #label>
                  <span class="label-required">{{$t('login.address1')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.address1" placeholder="Address 1" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('login.address2')">
                <c-input v-model:value="form.address2" placeholder="Address 2" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.city">
                <template #label>
                  <span class="label-required">{{$t('login.city')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.city" placeholder="City" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.postCode">
                <template #label>
                  <span class="label-required">{{$t('login.postCode')}}<span class="required">*</span></span>
                </template>
                <c-input v-model:value="form.postCode" placeholder="Post Code" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.country">
                <template #label>
                  <span class="label-required">{{$t('login.country')}}<span class="required">*</span></span>
                </template>
                <a-select
                  v-model:value="form.country"
                  show-search
                  placeholder="Country"
                  :options="countryOptions"
                  @change="handleCountryChange"
                  allow-clear
                  :filter-option="filterOption"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.province">
                <template #label>
                  <span class="label-required">{{$t('login.region')}}<span class="required">*</span></span>
                </template>
                <a-select
                  v-model:value="form.province"
                  show-search
                  placeholder="Region / State"
                  :options="provinceOptions"
                  allow-clear
                  :filter-option="filterOption"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.hearAbout">
                <template #label>
                  <span class="label-required">{{$t('login.hearAbout')}}<span class="required">*</span></span>
                </template>
                <a-select
                  v-model:value="form.hearAbout"
                  :placeholder="$t('login.hearAbout')"
                  :options="hearAboutOptions"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.businessDuration">
                <template #label>
                  <span class="label-required">{{$t('login.businessDuration')}}<span class="required">*</span></span>
                </template>
                <a-textarea
                  v-model:value="form.businessDuration"
                  :placeholder="$t('login.businessDuration')"
                  :auto-size="{ minRows: 2, maxRows: 4 }"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('login.locationCount')">
                <a-input v-model:value="form.locationCount" placeholder="How many locations do you have?" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('login.hardwareAmount')">
                <a-textarea
                  v-model:value="form.hardwareAmount"
                  :placeholder="$t('login.hardwareAmount')"
                  :auto-size="{ minRows: 2, maxRows: 4 }"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('login.liquidAmount')">
                <a-textarea
                  v-model:value="form.liquidAmount"
                  :placeholder="$t('login.liquidAmount')"
                  :auto-size="{ minRows: 2, maxRows: 4 }"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item v-bind="validateInfos.contactMethod">
                <template #label>
                  <span class="label-required">{{$t('login.contactMethod')}}<span class="required">*</span></span>
                </template>
                <a-select
                  v-model:value="form.contactMethod"
                  :placeholder="$t('login.contactMethod')"
                  :options="contactMethodOptions"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('login.notes')">
                <a-textarea
                  v-model:value="form.notes"
                  :placeholder="$t('login.notes')"
                  :auto-size="{ minRows: 2, maxRows: 4 }"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </section>

          <a-row :span="12" align="center">
            <a-form-item v-bind="validateInfos.verifyCode">
              <template #label>
                <span class="label-required">{{$t('login.enterCodeBelow')}}<span class="required">*</span></span>
              </template>
              <c-input v-model:value="form.verifyCode" placeholder="Verification Code" :funIcon="true">
                <a-button type="text" class="code-btn" @click="sendCode" :loading="getCoding" :disabled="isCode">
                  {{ isCode ? `${time}s` : $t('login.getCode') }}
                </a-button>
              </c-input>
            </a-form-item>
          </a-row>
          <a-row align="center">
            <a-button type="primary" class="submit-btn" block @click="submitForm" :loading="loading" align="center">
              {{$t('login.createAccount')}}
            </a-button>
          </a-row>
          <a-row align="center">
            <a-form-item v-bind="validateInfos.agree" class="agreement-item">
              <a-checkbox v-model:checked="form.agree">
                {{$t('login.agree')}}
                <span class="link" @click.prevent="showModal">{{$t('login.privacyPolicy')}}</span>
              </a-checkbox>
            </a-form-item>
          </a-row>
      </a-form>

      <div class="bottom-link">
        {{$t('login.alreadyHaveAccount')}}
        <span class="link" @click="goLogin">{{$t('login.login')}}</span>
      </div>
    </div>

    <a-modal v-model:open="openAgree" :width="600" title="Basic Modal" @ok="handleOk">
      <div v-html="dealHtml"/>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onBeforeUnmount, getCurrentInstance } from 'vue'
import {userDeal} from '@/api/login'
import { useRouter } from 'vue-router'
import {Form, message} from 'ant-design-vue'
import { register, getSignCode } from '@/api/login'
import countryRegionData from '@/assets/data/area.json'
const emit = defineEmits(['switchToLogin'])

const openAgree = ref(false);
const dealHtml = ref('')
function getDeal() {
  userDeal({type: 1}).then(r => {
    dealHtml.value = r.data
  })
}
const showModal = () => {
  openAgree.value = true;
}
const handleOk = e => {
  openAgree.value = false;
}
getDeal()

const router = useRouter()
const { proxy } = getCurrentInstance()

const useForm = Form.useForm
const defaultForm = {
  recommendationCode: '',
  accountType: undefined,
  firstName: '',
  lastName: '',
  email: '',
  telephone: '',
  password: '',
  confirmPassword: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  postCode: '',
  country: undefined,
  province: undefined,
  hearAbout: undefined,
  businessDuration: '',
  locationCount: '',
  hardwareAmount: '',
  liquidAmount: '',
  contactMethod: undefined,
  notes: '',
  verifyCode: '',
  agree: false,
}

const form = reactive({ ...defaultForm })

const accountTypeOptions = [
  { label: 'Retailer', value: 'retailer' },
  { label: 'Distributor', value: 'distributor' },
  { label: 'Service Provider', value: 'service_provider' },
  { label: 'Other', value: 'other' },
]

const hearAboutOptions = [
  { label: proxy.$t('login.hearAboutOptions.search_engine'), value: 'search_engine' },
  { label: proxy.$t('login.hearAboutOptions.social_media'), value: 'social_media' },
  { label: proxy.$t('login.hearAboutOptions.trade_show'), value: 'trade_show' },
  { label: proxy.$t('login.hearAboutOptions.referral'), value: 'referral' },
  { label: proxy.$t('login.hearAboutOptions.other'), value: 'other' },
]

const contactMethodOptions = [
  { label: proxy.$t('login.contactMethodOptions.email'), value: 'email' },
  { label: proxy.$t('login.contactMethodOptions.phone'), value: 'phone' },
  { label: proxy.$t('login.contactMethodOptions.whatsapp'), value: 'whatsapp' },
  { label: proxy.$t('login.contactMethodOptions.wechat'), value: 'wechat' }
]

const countryOptions = computed(() =>
  countryRegionData.map((item) => ({ label: item.name, value: item.name, data: item }))
)
const provinceOptions = ref([])

function handleCountryChange(value) {
  const selected = countryRegionData.find((item) => item.name === value)
  provinceOptions.value = selected?.regions?.map((region) => ({ label: region.name, value: region.name })) || []
  form.province = undefined
}

function filterOption(input, option) {
  return option?.label?.toLowerCase().includes(input.toLowerCase())
}

const emailPattern = /^([a-zA-Z0-9_.+-])+@([a-zA-Z0-9-])+\.[a-zA-Z0-9-.]+$/

const { validate, validateInfos } = useForm(
  form,
  reactive({
    accountType: [
      {
        required: true,
        message: 'Please select account type',
      },
    ],
    firstName: [
      {
        required: true,
        message: 'Please enter first name',
      },
    ],
    lastName: [
      {
        required: true,
        message: 'Please enter last name',
      },
    ],
    email: [
      {
        required: true,
        message: 'Please enter email',
      },
      {
        pattern: emailPattern,
        message: 'Please enter a valid email',
      },
    ],
    telephone: [
      {
        required: true,
        message: 'Please enter telephone',
      },
    ],
    password: [
      {
        required: true,
        message: 'Please enter password',
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: 'Please confirm password',
      },
      {
        validator: (_, value) => {
          if (!value || value === form.password) {
            return Promise.resolve()
          }
          return Promise.reject(new Error('Passwords do not match'))
        },
      },
    ],
    address1: [
      {
        required: true,
        message: 'Please enter address 1',
      },
    ],
    city: [
      {
        required: true,
        message: 'Please enter city',
      },
    ],
    postCode: [
      {
        required: true,
        message: 'Please enter post code',
      },
    ],
    country: [
      {
        required: true,
        message: 'Please select country',
      },
    ],
    province: [
      {
        required: true,
        message: 'Please select region/state',
      },
    ],
    hearAbout: [
      {
        required: true,
        message: 'Please select how you heard about us',
      },
    ],
    businessDuration: [
      {
        required: true,
        message: 'Please enter business duration',
      },
    ],
    contactMethod: [
      {
        required: true,
        message: 'Please select preferred contact method',
      },
    ],
    verifyCode: [
      {
        required: true,
        message: 'Please enter verification code',
      },
    ],
    agree: [
      {
        validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('Please agree to the Privacy Policy'))),
      },
    ],
  })
)

const getCoding = ref(false)
const loading = ref(false)
const isCode = ref(false)
const time = ref(60)
const timer = ref(null)

function resetTimer() {
  isCode.value = false
  time.value = 60
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function sendCode() {
  validate(['email'])
    .then((res) => {
      getCoding.value= true
      getSignCode({ email: res.email }).then(() => {
        message.success('The verification code has been sent');
        isCode.value = true
        getCoding.value= false
        timer.value = setInterval(() => {
          time.value -= 1
          if (time.value <= 1) {
            resetTimer()
          }
        }, 1000)
      })
    })
    .catch(() => {
      message.error('Email verification failed');
    })
}

onBeforeUnmount(() => {
  resetTimer()
})

function submitForm() {
  validate()
    .then(() => {
      loading.value = true
      const payload = {
        recommendationCode: form.recommendationCode,
        accountType: form.accountType,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        telephone: form.telephone,
        password: form.password,
        company: form.company,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        postCode: form.postCode,
        country: form.country,
        province: form.province,
        hearAbout: form.hearAbout,
        businessDuration: form.businessDuration,
        locationCount: form.locationCount,
        hardwareAmount: form.hardwareAmount,
        liquidAmount: form.liquidAmount,
        contactMethod: form.contactMethod,
        notes: form.notes,
        verifyCode: form.verifyCode,
      }
      register(payload)
        .then(() => {
          proxy.$message.success(proxy.$t('login.registerSuc'))
          emit('switchToLogin')
        })
        .finally(() => {
          loading.value = false
        })
    })
    .catch(() => {})
}

function toDeal() {
  router.push({ path: '/agreement' })
}

function goLogin() {
  emit('switchToLogin')
}
</script>

<style lang="scss" scoped>
.register-page {
  display: flex;
  justify-content: center;
  background-color: #f6f7fb;
}

.register-container {
  width: 100%;
  max-width: 1070px;
  padding: 48px 56px 56px;
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
  background: #0c1f51;
  border-color: #0c1f51;
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
</style>
