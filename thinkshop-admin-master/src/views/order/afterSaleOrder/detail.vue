<script setup>
import { ref } from "vue";
import {getAfterSales} from "@/api/afterSale/index.js";
import AuditForm from "@/views/order/afterSaleOrder/components/AuditForm.vue";
import {getOrderLogistics} from "@/api/order/index.js";
import LogisticsInfo from "@/views/order/orderList/components/LogisticsInfo.vue";
const route = useRoute()

const loading = ref(false)
const tableData = ref([])
const symbol = ref('')
function init () {
  const {id, currencySymbol} = route.query
  symbol.value = currencySymbol
  getAfterSalesDetails(id)
}
// 物流信息
const logisticsInfo = ref([])
// 物流详细数据
const logisticsData = ref([])
// 获取售后详情
const orderData = ref({})
const causePicture = ref([])
function getAfterSalesDetails(id) {
  loading.value = true
  getAfterSales(id).then((res) => {
    orderData.value = res.data
    causePicture.value = orderData.value.explainImg.split(',');
    loading.value = false
    if (orderData.value.state === 2) {
      logisticsInfo.value = [{
        deliveryName: res.data.deliveryName,
        deliverySn: res.data.deliverySn
      }]
      getOrderLogistics(orderData.value.deliverySn).then((res) => {
        logisticsData.value = res.data
        loading.value = false
      }).catch(() => {})
    } else {
      loading.value = false
    }
  }).catch(() => {
    loading.value = false
  })
}

// 查看物流
const logisticsInfoRef = ref()
function viewLogistics () {
  logisticsInfoRef.value.show(logisticsInfo.value, logisticsData.value)
}

// 审核售后订单
const auditFormRef = ref()
function audit() {
  auditFormRef.value.show(orderData.value)
  refresh()
  // emit('rest')
}

function refresh() {
  getAfterSalesDetails(orderData.value.id)
}
init()
</script>

<template>
  <div>
    <div class="app-container" v-loading="loading">
      <div class="top-btn">
        <h3>审核状态</h3>
        <el-button v-if="orderData.state === 0" type="primary" @click="audit">审 核</el-button>
        <el-button v-if="orderData.state === 2" type="primary" @click="audit">同意退款</el-button>
      </div>
      <h3>基本信息</h3>
      <div class="basic-information">
        <el-row :gutter="20">
          <el-col :span="8"><div class="item"><span>售后编号：</span>{{orderData.afterSalesCode}}</div></el-col>
          <el-col :span="8"><div class="item"><span>订单编号：</span>{{orderData.orderCode}}</div></el-col>
          <el-col :span="8">
            <div class="item" v-if="orderData.state === -2"><span>售后状态：</span>商家拒绝</div>
            <div class="item" v-if="orderData.state === -1"><span>售后状态：</span>用户取消</div>
            <div class="item" v-if="orderData.state === 0"><span>售后状态：</span>已提交等待平台审核</div>
            <div class="item" v-if="orderData.state === 1"><span>售后状态：</span>平台已审核 等待用户发货</div>
            <div class="item" v-if="orderData.state === 2"><span>售后状态：</span>用户已发货</div>
            <div class="item" v-if="orderData.state === 3"><span>售后状态：</span>商家同意退款</div>
            <div class="item" v-if="orderData.state === 4"><span>售后状态：</span>退款成功</div>
          </el-col>
          <el-col :span="8"><div class="item"><span>下单用户：</span>{{orderData.orderUser }}</div></el-col>
          <el-col :span="8"><div class="item"><span>售后商品数量：</span>{{orderData.refundNumber}}</div></el-col>
          <el-col :span="8"><div class="item"><span>需退运费：</span>{{symbol}}{{orderData.totalPostage}}</div></el-col>
          <el-col :span="8">
            <div class="item" v-if="orderData.state === 0"><span>售后类型：</span>仅退款</div>
            <div class="item" v-if="orderData.state === 1"><span>售后类型：</span>退货退款</div>
          </el-col>
          <el-col :span="8"><div class="item"><span>申请原因：</span>{{orderData.reasons}}</div></el-col>
          <el-col :span="8"><div class="item"><span>售后总额：</span>{{symbol}}{{orderData.refundAmount}}</div></el-col>
          <el-col :span="8">
            <div class="description">
              <div class="description-tit">补充描述：</div>
              <div class="description-content">
                <div class="text">{{orderData.explains}}</div>
                <div class="list-img">
                  <el-image v-for="(item, index) of causePicture" :src="item" :key="index" style="width: 100px;height: 100px;margin-right: 10px"></el-image>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <h3>售后商品清单</h3>
      <div class="commodity-list">
        <el-table :data="orderData.details" style="width: 100%">
          <el-table-column align="center" prop="productName" label="商品名称" />
          <el-table-column align="center" prop="sku" label="规格" width="180" />
          <el-table-column align="center" prop="address" label="图片">
            <template #default="scope">
              <el-image
                  :src="scope.row.image"
                  fit="cover"
                  style="width: 80px; height: 80px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="num" label="售后数量" />
          <el-table-column align="center" prop="originalPrice" label="售价">
            <template #default="scope">
              <span>{{symbol}}{{scope.row.originalPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="实付价">
            <template #default="scope">
              <span>{{symbol}}{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="totalPrice" label="合计">
            <template #default="scope">
              <span>{{symbol}}{{scope.row.totalPrice}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="orderData.state === 2">
        <h3>物流信息</h3>
        <div class="logistics-info">
          <el-table :data="logisticsInfo" style="width: 100%">
            <el-table-column align="center" prop="deliveryName" label="物流公司" />
            <el-table-column align="center" prop="deliverySn" label="物流编号"/>
            <el-table-column align="center" label="操作">
              <template #default="scope">
                <div class="btnList">
                  <el-button type="primary" link @click="viewLogistics">查看物流</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <h3>售后记录</h3>
      <div class="order-log">
        <el-table :data="orderData.logs" style="width: 100%">
          <el-table-column align="center" prop="createTime" label="时间">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userTypeName" label="角色"/>
          <el-table-column align="center" prop="userName" label="操作人"/>
          <el-table-column align="center" prop="operateTypeName" show-overflow-tooltip />
        </el-table>
      </div>
    </div>
    <logistics-info ref="logisticsInfoRef"></logistics-info>
    <audit-form @rest="refresh" ref="auditFormRef"></audit-form>
  </div>
</template>

<style lang="scss" scoped>
.basic-information {
  .item {
    margin-bottom: 20px;
    display: flex;
    span {
      width: 130px;
      display: block;
      text-align: right;
    }
  }
  .description {
    display: flex;
    .description-tit {
      width: 100px;
      text-align: right;
    }
    .description-content {
      .text {
        margin-bottom: 10px;
      }
      .list-img {
        display: flex;
      }
    }
  }
}
.app-container {
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
  }
  .top-btn {
    h3 {
      width: 40%;
      background: linear-gradient( 90deg, #F5F6FA 0%, rgba(245,246,250,0) 100%);
      height: 64px;
      line-height: 64px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      width: 120px;
      height: 40px;
      border-radius: 2px;
    }
  }
}
</style>
