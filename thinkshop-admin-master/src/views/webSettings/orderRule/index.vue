<script setup>
import { ref, onMounted } from "vue";
import {upOrderRule} from "@/api/orderRule/index.js";
import { ElMessage } from 'element-plus'
import {getWebsitesetting, changeWebsitesetting} from "@/api/websiteSet/index.js";
const form = ref({}) // 表单数据
const formRules = ref({
  orderCancelHour: [
    { required: true, message: '请输入时间', trigger: 'blur' }
  ],
  automaticReceiptDays: [
    { required: true, message: '请输入时间', trigger: 'blur' }
  ],
  closeAfterSale: [
    { required: true, message: '请输入时间', trigger: 'blur' }
  ],
  automaticCancellationAfterSale: [
    { required: true, message: '请输入时间', trigger: 'blur' }
  ],
  passDayRejectComment: [
    { required: true, message: '请输入时间', trigger: 'blur' }
  ]
})
// 仅退款
const refundOnlyReason = ref([
  {
    ruleText: ''
  }
]) // 退货退款
const returnGoodsRefund = ref([
  {
    ruleText: ''
  }
])
// 新增仅退款原因
function addRefundOnlyReason() {
  refundOnlyReason.value.push(
      {
        ruleText: ''
      }
  )
}

// 删除仅退款原因
function delRefundOnlyReason(index) {
  refundOnlyReason.value.splice(index, 1)
}

// 新增退货退款原因
function addReturnGoodsForRefund() {
  returnGoodsRefund.value.push(
      {
        ruleText: ''
      }
  )
}

// 删除退货退款原因
function delReturnGoodsForRefund(index) {
  returnGoodsRefund.value.splice(index, 1)
}

// 保存规则
const loading = ref(false)
const orderRuleRef = ref()
function submit() {
  orderRuleRef.value.validate((valid) => {
    if (valid) {
      let isRefundOnlyReasonValid = checkArrayItemsNotEmpty(refundOnlyReason.value, 'ruleText');
      let isReturnGoodsForRefundValid = checkArrayItemsNotEmpty(returnGoodsRefund.value, 'ruleText');
      let isValid = isRefundOnlyReasonValid && isReturnGoodsForRefundValid;
      if (isValid) {
        form.value.refundOnlyReason = refundOnlyReason.value.map(obj => obj.ruleText);
        form.value.returnGoodsRefund = returnGoodsRefund.value.map(obj => obj.ruleText);
        loading.value = true
        changeWebsitesetting(form.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
          loading.value = false
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: '保存失败!',
          })
          loading.value = false
        })
      } else {
        ElMessage({
          type: 'error',
          message: '售后原因不能为空值!',
        })
      }
    }
  })
}
// 检测退款条件是否为空
function checkArrayItemsNotEmpty(array, field) {
  return array.every(item => item[field] !== '');
}

function getWebInfo() {
  getWebsitesetting().then((res) => {
    form.value = res.data
    refundOnlyReason.value = res.data.refundOnlyReason.map(text => ({ ruleText: text ? text : "" }));
    returnGoodsRefund.value = res.data.returnGoodsRefund.map(text => ({ ruleText: text ? text : "" }));
    console.log(refundOnlyReason.value, returnGoodsRefund.value)
    if (refundOnlyReason.value.length === 0) {
      refundOnlyReason.value.push('');
    }
    if (returnGoodsRefund.value.length === 0) {
      returnGoodsRefund.value.push('');
    }
  }).catch(() => {
  })
}
onMounted(() => {
  // 获取网站配置
  getWebInfo()
})
</script>

<template>
  <div class="app-container">
    <div class="order-rule">
      <h3>订单规则</h3>
      <el-form ref="orderRuleRef" :model="form" :rules="formRules" label-width="240px">
        <el-form-item class="rule-input" label="客户提交订单后，超过" prop="orderCancelHour">
          <el-input-number style="width: 80px;margin-right: 10px;" v-model="form.orderCancelHour" :controls="false" :max="999999999" :min="0" :precision="0" />小时内未付款，订单自动取消
        </el-form-item>
        <el-form-item class="rule-input" label="发货" prop="automaticReceiptDays">
          <el-input-number style="width: 80px;margin-right: 10px;" v-model="form.automaticReceiptDays" :controls="false" :max="999999999" :min="0" :precision="0" />天后，客户未确认收货，系统自动确认
        </el-form-item>
        <el-form-item class="rule-input" label="客户确认收货" prop="closeAfterSale">
          <el-input-number style="width: 80px;margin-right: 10px;" v-model="form.closeAfterSale" :controls="false" :max="999999999" :min="0" :precision="0" />天后，不可进行售后
        </el-form-item>
        <el-form-item class="rule-input" label="同意退货退款后，" prop="automaticCancellationAfterSale">
          <el-input-number style="width: 80px;margin-right: 10px;" v-model="form.automaticCancellationAfterSale" :controls="false" :max="999999999" :min="0" :precision="0" />天客户未寄回商品，则售后自动自动取消
        </el-form-item>
        <el-form-item class="rule-input" label="客户确认收货" prop="passDayRejectComment">
          <el-input-number style="width: 80px;margin-right: 10px;" v-model="form.passDayRejectComment" :controls="false" :max="999999999" :min="0" :precision="0" />天后，不可进行评价
        </el-form-item>
      </el-form>
      <h3>售后原因</h3>
      <div class="after-sales">
        <el-row>
          <el-col :span="12">
            <div class="after-sales-title">仅退款原因</div>
            <div class="item-box">
              <div class="after-input-item" v-for="(item, index) of refundOnlyReason" :key="index">
                <div class="item-border">
                  <el-input style="width: 300px" type="text" v-model="item.ruleText" />
                  <div class="icon-box delete" v-if="index !==0" @click="delRefundOnlyReason(index)"><el-icon color="#262626" :size="20"><Close /></el-icon></div>
                </div>
              </div>
            </div>
            <div class="add-btn" @click="addRefundOnlyReason"><el-icon :size="15"><Plus /></el-icon>新增</div>
          </el-col>
          <el-col :span="12">
            <div class="after-sales-title">退货退款</div>
            <div class="item-box">
              <div class="after-input-item" v-for="(item, index) of returnGoodsRefund" :key="index">
                <div class="item-border">
                  <el-input style="width: 300px" type="text" v-model="item.ruleText" />
                  <div class="icon-box delete" v-if="index !==0" @click="delReturnGoodsForRefund(index)"><el-icon color="#262626" :size="20"><Close /></el-icon></div>
                </div>
              </div>
            </div>
            <div class="add-btn" @click="addReturnGoodsForRefund"><el-icon :size="15"><Plus /></el-icon>新增</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="submit-box">
      <el-button class="submit" :loading="loading" type="primary" @click="submit">保 存</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.order-rule) {
  padding: 8px 16px;
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
    font-size: 16px;
  }
  .rule-input {
    font-size: 14px;
    color: #666666;
    font-weight: 500;
  }
  .after-sales {
    padding-left: 15px;
    .item-box {
      background: #F5F6FA;
      padding: 16px;
      margin-right: 24px;
    }
    .el-row {
      width: 800px;
      .after-sales-title {
        margin-bottom: 15px;
        font-size: 14px;
        color: #666666;
        font-weight: 500;
      }
      .after-input-item {
        margin-bottom: 15px;
        .item-border {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 2px;
          border: 1px solid #DDE0E6;
          justify-content: space-between;
        }
        .icon-box {
          cursor: pointer;
        }
        .delete {
          margin: 0 5px;
        }
        .el-input__wrapper {
          height: 32px;
          line-height: 32px;
          box-shadow: none;
          background: none;
          .el-input__inner {
            font-weight: 500;
          }
        }
      }
      .after-input-item:last-child {
        margin-bottom: 0;
      }
    }
    .add-btn {
      width: 72px;
      height: 32px;
      background: #2662F6;
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .top-btn {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      width: 120px;
      height: 40px;
    }
  }
}
.submit-box {
  margin-top: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
