<template>
  <div class="p-login">
    <div class="main-con">
      <p class="m-title">{{`${isLogin?$t('login.registered'):$t('login.register')}`}}</p>
      <p class="sub-title">{{`${isLogin?$t('login.loginTip'):$t('login.registerTip')}`}}</p>
      <a-form
        autocomplete="off"
        :model="form"
      >
        <a-form-item v-bind="validateInfos.firstName" v-if="!isLogin">
            <c-input v-model:value="form.firstName" placeholder="First name*"/>
        </a-form-item>
        <a-form-item v-bind="validateInfos.lastName" v-if="!isLogin">
            <c-input v-model:value.trim="form.lastName" placeholder="Last name*"/>
        </a-form-item>
        <a-form-item v-bind="validateInfos.email">
            <c-input v-model:value="form.email" :placeholder="`${$t('login.email')}*`"/>
        </a-form-item>
        <a-form-item v-bind="validateInfos.code" v-if="!isLogin">
          <c-input v-model:value="form.code" :placeholder="`${$t('login.code')}*`" class="c-input" :funIcon="true">
              <a-button
                type="text"
                @click="sendCode"
                :disabled="isCode"
              >
                {{`${isCode?time+'s':$t('login.getCode')}`}}
              </a-button>
          </c-input>
        </a-form-item>
        <a-form-item v-bind="validateInfos.password" class="p-item">
            <c-input type="password" v-model:value.trim="form.password" :placeholder="`${$t('login.password')}*`"/>
        </a-form-item>
      </a-form>
      <span class="tip cursor-p" v-if="isLogin" @click="openPasswordModal">{{$t('login.forgetPassword')}}？</span>
      <div class="login-box">
        <a-button
          class="login-btn s-btn"
          @click="submitForm"
          :loading="loading"
        >
          {{`${isLogin?$t('login.login'):$t('login.register')}`}}
        </a-button>
        <p class="r-tip">
          {{$t(`login.${isLogin?'no':'has'}Count`)}}，
          <span class="cursor-p" @click="switchFun">{{`${isLogin?$t('login.quickRegister'):$t('login.toLogin')}`}}</span>
        </p>
        <div class="parting-line" v-if="isLogin">
          <span>{{$t('login.otherLogin')}}</span>
        </div>
        <div class="other-type" v-if="isLogin">
          <Svg iconName='icon-guge'style="margin-right: 24px;" @click="otherLogin(1)" class="cursor-p"></Svg>
          <Svg iconName='icon-facebook' @click="otherLogin(2)" class="cursor-p"></Svg>
        </div>
        <p class="r-tip" v-else>
          {{$t('login.agree')}}
          <span class="cursor-p" @click="toDeal">{{$t('login.deal')}}</span>
        </p>
      </div>
    </div>
    <ForgetPassword v-model="open"/>
  </div>
</template>

<script setup>
import { Form } from 'ant-design-vue'
import Svg from './svg.vue'
import {register, login, googleLogin, facebookLogin, getSignCode} from '@/api/login'
import useUserStore from '@/store/modules/user'
import ForgetPassword from './forgetPassword.vue'

const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance()

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
</style>