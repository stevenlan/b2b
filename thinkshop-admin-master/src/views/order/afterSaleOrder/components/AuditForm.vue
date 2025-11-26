<script setup>
import {afterSalesAudit} from "@/api/afterSale/index.js";
import {ref, reactive, defineComponent} from "vue";

const emit = defineEmits(['rest'])

const visible = ref({
  detail: false
})
const state = ref(0) // 当前状态
function show (data) {
  auditForm.value.id = data.id
  state.value = data.state
  visible.value.detail = true
}

const form = ref({});

const auditForm = ref({
  id: null,
  isAgree: 1,
  remark: ''
});
const sendGoodsFormRef = ref(null)
const rules = ref({
  remark: [{required: true, message: '请填写拒接原因'}]
})
// 取消售后
function cancel () {
  visible.value.detail = false
}
// 同意售后
const loadingBtn = ref(false)
function submitForm() {
  loadingBtn.value = true
  afterSalesAudit(auditForm.value).then((res) => {
    loadingBtn.value = false
    visible.value.detail = false
    emit('rest')
  }).catch(() => {
    loadingBtn.value = false
  })
}
function afterSaleConfirm () {
  if(state===0) {
    sendGoodsFormRef.value.validate(valid => {
      if(valid) {
        submitForm()
      }
    })
  } else {
    submitForm()
  }
}
defineExpose({
  show
})
</script>

<template>
  <el-dialog
    v-model="visible.detail"
    :close-on-click-modal="false"
    :title="state === 2 ? '提示' : '审核'"
    width="30%"
    class="s-dialog"
  >
    <el-form
      ref="sendGoodsFormRef"
      :model="auditForm"
      :rules="rules"
      label-width="80px"
      v-if="state===0"
    >
      <el-form-item label="审核意见" prop="type">
        <el-radio-group v-model="auditForm.isAgree">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="0">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark" v-if="auditForm.isAgree===0">
        <el-input type="textarea" style="width: 300px" v-model="auditForm.remark" maxlength="20"
        />
      </el-form-item>
    </el-form>
    <p v-else>确认收货后退款金额将会原路返回至用户付款账户，是否确认收货？</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-loading="loadingBtn" type="primary" @click="afterSaleConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
