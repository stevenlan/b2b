<script setup>
import {ref, reactive, defineComponent} from "vue";
import {orderDelivery, getOrderDetail} from "@/api/order/index.js";
import {ElMessage} from "element-plus";

const visible = ref({
  detail: false
})

function show (data) {
  expressForm.value.id = data.id
  if (data.status === 1) {
    orderData.value = data
  } else {
    getDetail(data.id)
  }
  visible.value.detail = true
}

const loading = ref(false)
const btnloading = ref(false)

const expressForm = ref({
  id: null,
  deliveryName: '',
  deliveryId: '',
  deliverySn: '',
});
const expressRules = {
  deliveryId: [
    { required: true, message: '请输入快递单号', trigger: 'blur' },
  ],
  deliverySn: [
    { required: true, message: '请选择快递公司', trigger: 'blur' },
  ],
}
const companyList = ref([
  { deliverySn: '17track', deliveryName: '17track'},
])

const emit = defineEmits(['reset'])

// 取消发货
function cancel () {
  visible.value.detail = false
}
// 确定发货
const sendGoodsFormRef = ref(null)
function expressConfirm () {
  sendGoodsFormRef.value.validate((valid) => {
    if (valid) {
      let matchingCompany = companyList.value.find(company => company.deliverySn === expressForm.value.deliverySn);
      if (matchingCompany) {
        expressForm.value.deliveryName = matchingCompany.deliveryName;
      }
      btnloading.value = true
      orderDelivery(expressForm.value).then((res) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '发货成功!',
          })
          btnloading.value = false
          visible.value.detail = false
          btnloading.value = false
          emit('reset')
        }
      }).catch(() => {
        btnloading.value = false
        ElMessage({
          type: 'error',
          message: '发货失败!',
        })
        btnloading.value = false
      }).finally(() => {
        btnloading.value = false
      })
    }
  })
}
const orderData = ref({}) // 订单详情数据
function getDetail(id) {
  getOrderDetail(id).then((res) => {
    orderData.value = res.data
  }).catch(() => {
    console.log('err')
  })
}

defineExpose({
  show
})
</script>

<template>
  <el-dialog
      v-model="visible.detail"
      :close-on-click-modal="false"
      title="发货"
      width="26%"
  >
    <div v-loading="loading">
      <div class="recipient-info">
        <div class="info-item"><div>收货人</div><span>{{orderData.firstName}} {{orderData.lastName}}</span></div>
        <div class="info-item"><div>收货电话</div><span>{{orderData.userPhone}}</span></div>
        <div class="info-item"><div>收货地址</div><span>{{orderData.addressDetail}}</span></div>
        <div class="info-item"><div>邮编</div><span>{{orderData.postCode}}</span></div>
      </div>
      <el-form
          ref="sendGoodsFormRef"
          :model="expressForm"
          :rules="expressRules"
          label-width="80px"
      >
        <el-form-item label="快递公司" prop="deliverySn">
          <el-select  style="width: 100%" v-model="expressForm.deliverySn" filterable>
            <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :label="item.deliveryName"
                :value="item.deliverySn"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="deliveryId">
          <el-input v-model="expressForm.deliveryId" maxlength="20" oninput="value = value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
          />
        </el-form-item>
      </el-form>
    </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="expressConfirm">确定发货</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.recipient-info {
  padding: 16px;
  background: #F5F6FA;
  margin-bottom: 20px;
  .info-item {
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    line-height: 30px;
    span {
      color: #999999;
      font-size: 14px;
    }
  }
}
</style>
