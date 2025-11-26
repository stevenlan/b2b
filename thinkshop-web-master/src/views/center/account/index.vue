<script setup>
import {getInfo, userInfoUpdate} from "@/api/login.js";
import {message} from "ant-design-vue";
import Spin from "@/utils/spin.js";
import ForgetPassword from "@/views/center/account/components/restPassword.vue";
const accountData = ref({})
const rules = ref([])
const email = ref('')
const password = ref('************')
const open = ref(false)
const loadingBtn = ref(false)
import { useI18n} from 'vue-i18n';
const { t } = useI18n();

function getUser() {
  const spinIntance = Spin.service({target: '#loading', alignItems: 'center'});
  getInfo().then((res) => {
    accountData.value = res.data
    spinIntance.close()
  }).catch((err) => {
    spinIntance.close()
  })
}

// 修改名称
function changeName() {
  loadingBtn.value = true
  userInfoUpdate({
    firstName: accountData.value.firstName,
    lastName: accountData.value.lastName
  }).then(res => {
    loadingBtn.value = false
    message.success(t('userCenter.modifySuccessfully'))
  }).catch((err) => {
    loadingBtn.value = true
    message.success(t('userCenter.modificationFailure'))
  })
}

// 修改密码
function openPasswordModal() {
  open.value = true
}
onMounted(() => {
  getUser()
})
</script>
<template>
  <div class="account" id="loading">
    <h3>{{t('myAccount.title')}}</h3>
    <div class="account-form">
      <a-form
          :model="accountData"
          :rules="rules"
          ref="formRef"
      >
        <a-form-item>
          <div class="e-cell">
            <c-input v-model:value="accountData.firstName" :placeholder="t('myAccount.firstName')" class="e-input" />
          </div>
        </a-form-item>
        <a-form-item>
          <div class="e-cell">
            <c-input v-model:value="accountData.lastName" :placeholder="t('myAccount.lastName')" class="e-input" />
          </div>
        </a-form-item>
      </a-form>
      <a-button class="save-btn" @click="changeName" :loading="loadingBtn">{{t('myAccount.save')}}</a-button>
      <div class="mailbox">
        <label>{{t('myAccount.mailbox')}}</label>
        <div>
          <a-input v-model:value="accountData.email" :disabled="true" :bordered="true" class="e-input" />
        </div>
      </div>
      <div class="mailbox">
        <label>{{t('myAccount.passwordChange')}}</label>
        <div class="password-box">
          <a-input v-model:value="password" type="password" :disabled="true" :bordered="true" class="e-input" />
          <span @click="openPasswordModal">{{t('myAccount.alter')}}</span>
        </div>
      </div>
    </div>
    <ForgetPassword :email="accountData.email" v-model="open"/>
  </div>
</template>
<style lang="scss" scoped>
.account {
  position: relative;
  h3 {
    margin-bottom: 50px;
  }
  .account-form {
    width: 100%;
    .save-btn {
      width: 100px;
      height: 44px;
      color: #ffffff;
      background: #262626;
      margin-bottom: 40px;
    }
  }
  .mailbox {
    margin-bottom: 15px;
    label {
      font-size: 14px;
      color: #262626;
      font-weight: 500;
    }
    .e-input {
      margin-top: 10px;
      border: none;
    }
    .password-box {
      position: relative;
      width: 400px;
      span {
        position: absolute;
        right: 10px;
        top: 22px;
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
        color: #262626;
      }
    }
  }
  .e-cell {
    position: relative;
  }
  :deep(.e-input) {
    height: 44px;
    width: 400px;
  }
  :deep(.ant-input-affix-wrapper) {
    height: 58px;
    margin-bottom: 5px;
  }
  :deep(.p-item ) {
    margin-bottom: 0;
  }
}
</style>
