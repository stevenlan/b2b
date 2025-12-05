<template>
  <div>
    <div v-if="!showRegister" class="register-page">
      <div class="register-container">
        <h1 class="page-title">{{$t('login.pageTitleLogin')}}</h1>
        <p class="page-subtitle">{{$t('login.pageSubtitle')}}</p>
        <a-form autocomplete="off" :model="form" layout="vertical">
          <section class="form-section">
            <a-row :gutter="24" style="justify-content: center">
              <a-col :span="12">
                <a-form-item v-bind="validateInfos.email">
                  <template #label>
                    <span class="label-required">Email<span class="required">*</span></span>
                  </template>
                  <c-input v-model:value="form.email" placeholder="Email" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="justify-content: center">
              <a-col :span="12">
                <a-form-item v-bind="validateInfos.password">
                  <template #label>
                    <span class="label-required">Password<span class="required">*</span></span>
                  </template>
                  <c-input v-model:value="form.password" placeholder="Password" />
                </a-form-item>
              </a-col>
            </a-row>
          </section>
        <a-row align="center">
          <a-button type="text" class="submit-btn" block @click="submitForm" :loading="loading" align="center">
            {{$t('login.login')}}
          </a-button>
        </a-row>
        <a-row align="center" style="margin-top:12px;">
          <span class="tip cursor-p" @click="openPasswordModal">{{$t('login.forgetPassword')}}？</span>
        </a-row>
        </a-form>

        <div class="bottom-link">
          {{$t('login.noCount')}}
          <span class="link" @click="goLogin">{{$t('login.register')}}</span>
        </div>
      </div>
    </div>

    <Register v-else @switchToLogin="showRegister=false"/>

    <ForgetPassword v-model="open"/>
  </div>
</template>

<script setup>
import { Form } from 'ant-design-vue'
import Svg from './svg.vue'
import {register, login, googleLogin, facebookLogin, getSignCode} from '@/api/login'
import useUserStore from '@/store/modules/user'
import ForgetPassword from './forgetPassword.vue'
import Register from "@/views/login/register.vue";

const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance()
const showRegister = ref(false)

const useForm = Form.useForm;
const defaultForm = {
  firstName: '',
  lastName: '',
  code: '',
  email: '',
  password: ''
}
const form = reactive({...defaultForm})
// 登录、注册切换
const isLogin = ref(true)
const { resetFields, validate, validateInfos } = useForm(
  form,
  reactive({
    firstName: [
      {
        required: true,
        message: proxy.$t('login.firstNameTip'),
      }
    ],
    lastName: [
      {
        required: true,
        message: proxy.$t('login.lastNameTip'),
      }
    ],
    email: [
      {
        required: true,
        message: proxy.$t('login.emailTip'),
      },
      {
        pattern: new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/),
        message: proxy.$t('login.emailTips'),
      }
    ],
    code: [
      {
        required: true,
        message: proxy.$t('login.codeTip'),
      }
    ],
    password: [
      {
        required: true,
        message: proxy.$t('login.passwordTip'),
      }
    ]
  })
)
const loading = ref(false)
// 缓存跳转登录页的前一个路由
const redirect = ref(undefined);
const open = ref(false)

// 控制发送验证码
const isCode = ref(false)
const time = ref(60)
const timer = ref(null)

watch(route, (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect;
}, { immediate: true })

function resetTimer() {
  isCode.value = false
  time.value = 60
  clearInterval(timer)
}
// 发送验证码
function sendCode() {
  validate(['email']).then(res => {
    getSignCode({email: res.email}).then(() => {
      isCode.value = true
      timer.value = setInterval(() => {
        time.value--
        if(time.value===1) {
          resetTimer()
        }
      }, 1000)
    })
  })
}
function submitForm() {
  const fields = ['email', 'password', ...(isLogin.value?[]:['firstName', 'lastName', 'code'])]
  validate(fields).then(r => {
    if(isLogin.value) {
      loading.value = true
      // 登录
      userStore.login(r).then(() => {
        const query = {}
        if(redirect.value) {
          const t = redirect.value.split("?")
          t.forEach((it) => {
              let j = it.split("=");
              query[j[0]] = j[1]
          })
        }
        router.push({ path: redirect.value || "/", query })
      }).catch(() => {
        loading.value = false;
      })
    } else {
      // 注册
      register(r).then(res => {
        proxy.$message.success(proxy.$t('login.registerSuc'))
        // 注册完跳登录
        switchFun()
      })
    }
  }).catch(err => {
    throw(err)
  })
}
// 切换登录和注册
function switchFun() {
  isLogin.value = !isLogin.value
  resetFields()
}
/* ---忘记密码--- */
function openPasswordModal() {
  open.value = true
}
// 用户协议
function toDeal() {
  router.push({path: '/agreement'})
}
// 三方登录
function otherLogin(type) {
  const api = type===1?googleLogin:facebookLogin
  api().then(r => {
    window.open(r.data, '_self')
  })
}
// 跳转注册
function goLogin() {
  showRegister.value = true
}
</script>

<style lang="scss" scoped>
.p-login {
  padding-top: 50px;
  .h44 {
    height: 44px;
  }
  .main-con {
    width: 400px;
    margin:0 auto;
    p {
      margin-bottom: 0;
    }
    .m-title {
      color: #262626;
      font-size: 20px;
      margin-bottom: 5px;
    }
    .sub-title {
      color: #8C8C8C;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .tip {
      color: #8C8C8C;
      font-size: 12px;
      text-decoration: underline;
    }
    :deep(.ant-form-item) {
      margin-bottom: 16px;
    }
    :deep(.p-item ) {
      margin-bottom: 0;
    }
    .login-box {
      .login-btn {
        margin: 32px 0 16px;
      }
      .r-tip {
        text-align: center;
        font-size: 14px;
        margin-bottom: 32px;
        span {
          text-decoration: underline;
        }
      }
      .parting-line {
        background: #E5E5E5;
        height: 1px;
        position: relative;
        margin-bottom: 40px;
        span {
          display: block;
          background: #FFFFFF;
          position: absolute;
          padding: 0 15px;
          top: -10px;
          left: calc(50% - 100px);
          font-size: 14px;
          color: #8C8C8C;
        }
      }
      .other-type {
        text-align: center;
      }
    }
  }
}
.register-page {
  display: flex;
  justify-content: center;
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
  background: #110000;
  border-color: #110000;
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
</style>
