<template>
  <a-modal
    v-model:open="open"
    :footer="null"
    :closable="false"
    @cancel="cancel"
    class="s-modal"
    width="448px"
  >
    <div class="h-cell">
        <p>{{$t('login.forgetPassword')}}</p>
        <p>{{$t('login.forgetSub')}}</p>
    </div>
    <a-form
      autocomplete="off"
    >
      <a-form-item v-bind="validateInfos.email">
        <div class="e-cell">
          <c-input v-model:value="form.email" :placeholder="`${$t('login.email')}*`"/>
        </div>
      </a-form-item>
      <a-form-item v-bind="validateInfos.code">
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
          <c-input type="password" v-model:value="form.password" :placeholder="`${$t('login.newPassword')}*`"/>
      </a-form-item>
      <a-form-item>
        <a-button class="s-btn" @click="submitForm">{{$t('common.confirm')}}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { Form } from 'ant-design-vue';
import {getCode, forgetPassword} from '@/api/login'

const {proxy} = getCurrentInstance()
const useForm = Form.useForm

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const {modelValue} = toRefs(props)
const emits = defineEmits()
// 控制弹框显隐
const open = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
const defaultForm = {
  email: '',
  code: '',
  password: ''
}
const form = reactive({...defaultForm})
const { resetFields, validate, validateInfos } = useForm(
  form,
  reactive({
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
        message: proxy.$t('login.newPasswordTip'),
      }
    ]
  })
)
// 控制发送验证码
const isCode = ref(false)
const time = ref(60)
const timer = ref(null)

function resetTimer() {
  isCode.value = false
  time.value = 60
  clearInterval(timer)
}
// 发送验证码
function sendCode() {
  validate(['email']).then(res => {
    getCode({email: res.email}).then(() => {
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
function cancel() {
  resetFields()
}
// 提交修改
function submitForm() {
  validate().then(r => {
    forgetPassword(r).then(() => {
      emits('update:modelValue', false)
    })
  })
}
</script>

<style scoped lang="scss">
.s-modal {
  .h-cell {
    text-align: center;
    margin-bottom: 20px;
    p {
      margin: 0;
      color: #8C8C8C;
      font-size: 14px;
      &:first-child {
        color: #262626;
        font-size: 20px;
        margin-bottom: 5px;
      }
    }
  }
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}
</style>