<template>
  <div class="p24">
    <p class="m-title mb16">
      {{query.type==='notice'?'公告':'系统消息模版'}}
    </p>
    <el-tabs v-model="activeName" v-if="query.type==='msg'">
      <el-tab-pane label="站内信" name="1"/>
      <el-tab-pane label="邮件模版" name="2"/>
    </el-tabs>
    <el-form
      :model="form"
      :rules="rules"
      label-width="100px"
      ref="formRef"
      class="w70"
    >
      <el-form-item :label="`${query.type==='notice'?'公告':'通知'}标题`" :prop="filedOb.title">
        <el-input
          v-model="form[filedOb.title]"
          :placeholder="`请输入${query.type==='notice'?'公告':'通知'}标题`"
          maxlength="500"
        />
      </el-form-item>
      <el-form-item :label="`${query.type==='notice'?'公告':'通知'}内容`" :prop="filedOb.con">
        <editor
          v-model="form[filedOb.con]"
          :min-height="300"
        />
      </el-form-item>
    </el-form>
    <el-affix :offset="0" position='bottom'>
      <div class="btn-list  w70">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import {sysMessageInfo, updateSysMessage, addNotice, updateNotice, queryNoticeInfo} from '@/api/websiteSet'

const route = useRoute()
const {proxy} = getCurrentInstance()

const query = ref(route.query)
const form = ref({})
const formRef = ref(null)
const rules = ref({
  noticeTitle: [{required: true, message: '请输入公告标题'}],
  noticeContent: [{required: true, message: '请输入公告内容'}],
  informTitle: [{required: true, message: '请输入通知标题'}],
  informTemplate: [{required: true, message: '请输入通知标题'}],
  emailTitle: [{required: true, message: '请输入通知标题'}],
  emailTemplate: [{required: true, message: '请输入通知标题'}]
})
const activeName = ref('1')

const filedOb = computed(() => {
  const {type=''} = query.value
  if(type==='notice') {
    return {
      title: 'noticeTitle',
      con: 'noticeContent'
    }
  }
  if(type==='msg') {
    if(activeName.value==='1') {
      return {
        title: 'informTitle',
        con: 'informTemplate'
      }
    } else {
      return {
        title: 'emailTitle',
        con: 'emailTemplate'
      }
    }
  }
})

function close() {
  const obj = { path: "/webSettings/notice" };
  proxy.$tab.closeOpenPage(obj)
}
function submitForm() {
  const {type, id} = query.value
  let api = addNotice
  if(id) api = type==='notice'?updateNotice:updateSysMessage
  formRef.value.validate(valid => {
    if(valid) {
      api(form.value).then(r => {
        proxy.$modal.msgSuccess('保存成功')
        close()
      })
    }
  })
}
function init() {
  const {id, type} = query.value
  if(!id) return
  const api = type==='notice'?queryNoticeInfo:sysMessageInfo
  api(id).then(r => {
    form.value = r.data
  })
}

init()
</script>

<style scoped lang="scss">
.btn-list {
  background: #FFFFFF;
  text-align: center;
  padding: 30px 0;
}
.w70 {
  width: 70%;
}
:deep(.editor) {
  width: 100%;
}
</style>