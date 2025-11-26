<script setup>
import {getAgreement, updateServiceAgreement} from "@/api/orderRule/index.js";
import {ElMessage} from "element-plus";

const form = ref({
  userAgreement: '',
  privacyPolicy: ''
})

const loading = ref(false)
// 保存富文本
 function submit() {
  loading.value = true
   let data = {
     userAgreement: form.value.userAgreement,
     privacyPolicy: form.value.privacyPolicy
   }
   updateServiceAgreement(data).then(() => {
     ElMessage({
       type: 'success',
       message: '修改成功!',
     })
     loading.value = false
   }).catch(() => {
     ElMessage({
       type: 'error',
       message: '修改失败!',
     })
     loading.value = false
   })
 }
 function getAgreementList() {
   getAgreement().then(res => {
     form.value.userAgreement = res.data.userAgreement
     form.value.privacyPolicy = res.data.privacyPolicy
   })
 }
 onMounted(() => {
   getAgreementList()
 })
</script>

<template>
  <div class="app-container">
    <div class="service-agreement">
      <div class="user-agreement">
        <div class="top-btn">
          <h3>用户协议</h3>
          <el-button :loading="loading" type="primary" @click="submit">保 存</el-button>
        </div>
        <p>定义网站注册用户使用条款和注意事项，入口在注册页面，会生成独立的页面，可以将页面添加到网站导航</p>
        <editor v-model="form.userAgreement" :min-height="300"/>
      </div>
      <h3>隐私政策</h3>
      <p>定义网站隐私政策相关信息，会生成独立的页面，可以将页面添加到网站导航</p>
      <editor v-model="form.privacyPolicy" :min-height="300"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.service-agreement {
  padding: 0 16px;
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
    color: #262626;
    font-size: 16px;
  }
  p {
    font-size: 14px;
    color: #8C8C8C;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .user-agreement {
    .top-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        width: 40%;
        background: linear-gradient( 90deg, #F5F6FA 0%, rgba(245,246,250,0) 100%);
        height: 64px;
        line-height: 64px;
        color: #262626;
        font-size: 16px;
        padding-left: 15px;
      }
      button {
        width: 120px;
        height: 40px;
      }
    }
  }
}
</style>
