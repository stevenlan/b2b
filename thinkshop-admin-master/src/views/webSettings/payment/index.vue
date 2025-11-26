<script setup>
import PayForm from "@/views/webSettings/payment/components/payForm.vue";
import {getPaymentList, upPayment} from "@/api/payment/index.js";
import {ElMessage} from "element-plus";
import {getWebsitesetting, changeWebsitesetting} from "@/api/websiteSet/index.js";
const tableData = ref([])

// 配置付款信息
 function configuration(row) {
   payFormRef.value.show(row)
 }

 // 配置弹窗
const payFormRef = ref()
// 获取支付配置列表
function getPayment() {
  getPaymentList().then((res) => {
    tableData.value = res.rows
  })
}

// 修改支付配置开关
function modifySwitch(item, status) {
  let data = item
  data.status = status
  upPayment(data).then(res => {
    ElMessage.success('修改成功')
    getPayment()
  }).catch(() => {
    ElMessage.success('修改失败')
    getPayment()
  })
}
// 获取网站配置
function getWebInfo() {
  getWebsitesetting().then((res) => {
    formData.value = res.data
  }).catch(() => {
  })
}

// 提交表单
const formData = ref({})
const rules = ref({
  salesTaxRate: [{required: true, message: "请输入销售税率", trigger: "blur"}],
  freightRate: [{required: true, message: "请输入运费税率", trigger: "blur"}],
})
const formRef = ref()
const loading = ref(false)
function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      changeWebsitesetting(formData.value).then(res => {
        ElMessage.success('保存成功')
        loading.value = false
      }).catch(() => {
        ElMessage.success('保存失败')
        loading.value = false
      })
    }
  })
}
onMounted(() => {
  getPayment()
  getWebInfo()
})
</script>

<template>
  <div class="app-container">
    <div class="payment">
      <h3>收款</h3>
      <el-table :data="tableData" style="width: 50%" border>
        <el-table-column align="center" label="收款方式">
          <template #default="scope">
            <div class="payment-method">
              <el-image
                  :src="scope.row.logo"
                  fit="cover"
                  style="width: 40px; height: 40px;margin-right: 10px"
              ></el-image>
              <span>{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="modifySwitch(scope.row, scope.row.status)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <div class="btnList">
              <el-button type="primary" link @click="configuration(scope.row)">配置</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <h3>税率</h3>
      <div class="form-box">
        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="80px"
        >
          <el-row :gutter="20" class="form-row">
            <el-col :span="12">
<!--              <div class="title">销售税率</div>-->
              <el-form-item label="销售税率" prop="salesTaxRate">
<!--                <el-input type="text" v-model="formData.salesTaxRate" placeholder="请输入销售税率">-->
<!--                  <template #append>%</template>-->
<!--                </el-input>-->
                <el-input-number style="width: 180px;margin-right: 10px;" v-model="formData.salesTaxRate" :controls="false" :max="100" :min="0" :precision="2" />%
              </el-form-item>
            </el-col>
            <el-col :span="12">
<!--              <div class="title">运费税率</div>-->
              <el-form-item label="运费税率" prop="freightRate">
<!--                <el-input type="text" v-model="formData.freightRate" placeholder="请输入运费税率">-->
<!--                  <template #append>%</template>-->
<!--                </el-input>-->
                <el-input-number style="width: 180px;margin-right: 10px;" v-model="formData.freightRate" :controls="false" :max="100" :min="0" :precision="2" />%
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="payment-btn">
      <el-button v-loading="loading" type="primary" @click="submit">保 存</el-button>
    </div>
    <pay-form @rest="getPayment" ref="payFormRef"></pay-form>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 24px 32px;
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
    font-size: 16px;
  }
  .payment {
    .payment-method {
      display: flex;
      align-items: center;
      justify-content: center
    }
    .form-box {
      width: 600px;
      .title {
        color: #606266;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 10px;
      }
    }
    .top-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        width: 120px;
        height: 40px;
      }
    }
  }
  .payment-btn {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 100px;
    text-align: center;
  }
}
</style>

