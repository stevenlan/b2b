<script setup>
import { ref } from "vue";
import LogisticsInfo from "@/views/order/orderList/components/LogisticsInfo.vue";
import {getOrderDetail, getOrderLogistics} from "@/api/order/index.js";
import DeliverGoods from "@/views/order/orderList/components/DeliverGoods.vue";
const route = useRoute()

const visible = ref({
  detail: false
});
const loading = ref(false)
// 物流信息
const logisticsInfo = ref([])
// 物流详细数据
const logisticsData = ref([])
const orderData = ref({}) // 订单详情数据
const symbol = ref('')
function init () {
  const {id, currencySymbol} = route.query
  // symbol.value = currencySymbol
  orderData.value = {}
  getDetail(id)
  visible.value.detail = true
}
function getDetail(id) {
  loading.value = true
  getOrderDetail(id).then((res) => {
    orderData.value = res.data
    if (res.data.deliveryId) {
      logisticsInfo.value = [{
        deliveryName: res.data.deliveryName,
        deliveryId: res.data.deliveryId
      }]
      getOrderLogistics(orderData.value.deliveryId).then((res) => {
        logisticsData.value = res.data
        loading.value = false
      }).catch(() => {})
    } else {
      loading.value = false
    }
  }).catch(() => {
    console.log('err')
  })
}
// 查看物流
const logisticsInfoRef = ref()
function viewLogistics () {
  logisticsInfoRef.value.show(logisticsInfo.value, logisticsData.value)
}

// 发货
const deliverGoodsRef = ref()
function toDeliverGoods() {
  deliverGoodsRef.value.show(orderData.value)
}

// 重新请求数据
function reset() {
  getDetail(orderData.value.id)
}
init()
</script>

<template>
  <div>
    <div class="app-container" v-loading="loading">
      <h3>基本信息</h3>
      <div class="basic-information">
        <el-row :gutter="20">
          <el-col :span="8"><div class="item"><span>订单编号：</span>{{orderData.orderCode}}</div></el-col>
          <el-col :span="8"><div class="item"><span>下单时间：</span>{{parseTime(orderData.createTime)}}</div></el-col>
          <el-col :span="8">
            <div class="item" v-if="orderData.status === 0"><span>订单状态：</span>待付款</div>
            <div class="item" v-if="orderData.status === 1"><span>订单状态：</span>待发货</div>
            <div class="item" v-if="orderData.status === 2"><span>订单状态：</span>已发货</div>
            <div class="item" v-if="orderData.status === 3"><span>订单状态：</span>已完成</div>
            <div class="item" v-if="orderData.status ===-1"><span>订单状态：</span>已取消</div>
          </el-col>
          <el-col :span="8"><div class="item"><span>下单用户：</span>{{orderData.orderUser}}</div></el-col>
          <el-col :span="8"><div class="item"><span>订单商品数量：</span>{{orderData.totalNum}}</div></el-col>
          <!-- <el-col :span="8"><div class="item"><span>物流费用：</span>{{symbol}}{{orderData.totalPostage}}</div></el-col> -->
          <el-col :span="8"><div class="item"><span>商品总计：</span>{{symbol}}{{orderData.totalPrice}}</div></el-col>
          <el-col :span="8"><div class="item"><span>优惠券金额：</span>{{symbol}}{{orderData.couponPrice}}</div></el-col>
          <el-col :span="8"><div class="item"><span>积分抵扣：</span>{{symbol}}{{orderData.integralDeduct}}</div></el-col>
          <el-col :span="8"><div class="item"><span>销售税：</span>{{symbol}}{{orderData.taxation}}</div></el-col>
          <el-col :span="8"><div class="item"><span>运费税：</span>{{symbol}}{{orderData.postageTaxation}}</div></el-col>
          <el-col :span="8"><div class="item"><span>实付款：</span>{{symbol}}{{orderData.payPrice}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8"><div class="item"><span>支付单号：</span>{{orderData.paymentIntentId}}</div></el-col>
          <el-col :span="8"><div class="item"><span>支付时间：</span>{{parseTime(orderData.payTime)}}</div></el-col>
          <el-col :span="8"><div class="item"><span>邮编：</span>{{orderData.postCode}}</div></el-col>
          <el-col :span="8"><div class="item"><span>收货人姓名：</span>{{orderData.firstName}} {{orderData.lastName}}</div></el-col>
          <el-col :span="8"><div class="item"><span>收货人手机号：</span>{{orderData.userPhone}}</div></el-col>
          <el-col :span="8"><div class="item"><span>收货地址：</span>{{orderData.addressDetail}}</div></el-col>
          <el-col :span="8"><div class="item"><span>用户备注：</span>{{orderData.mark}}</div></el-col>
        </el-row>
      </div>
      <h3>商品清单</h3>
      <div class="commodity-list">
        <el-table :data="orderData.details" style="width: 100%">
          <el-table-column align="center" prop="productName" label="商品名称" />
          <el-table-column align="center" prop="sku" label="规格" width="180" />
          <el-table-column align="center" prop="image" label="图片">
            <template #default="scope">
              <el-image
                  :src="scope.row.image"
                  fit="cover"
                  style="width: 80px; height: 80px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="num" label="购买数量" />
          <el-table-column align="center" prop="originalPrice" label="售价">
            <template #default="scope">
              <span>{{symbol}}{{scope.row.originalPrice}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="price" label="实付价">
            <template #default="scope">
              <span>{{symbol}}{{scope.row.price}}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="totalPrice" label="合计">
            <template #default="scope">
              <span>{{symbol}}{{scope.row.totalPrice}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="orderData.status === 1 || orderData.status === 2 || orderData.status === 3">
        <h3>物流信息</h3>
        <div class="logistics-info">
          <el-table :data="logisticsInfo" style="width: 100%">
            <el-table-column align="center" prop="deliveryName" label="物流公司" />
            <el-table-column align="center" prop="deliveryId" label="物流编号"/>
            <el-table-column align="center" label="操作">
              <template #default="scope">
                <div class="btnList">
                  <el-button type="primary" @click="viewLogistics" v-if="orderData.status === 2 || orderData.status === 3">查看物流</el-button>
                </div>
              </template>
            </el-table-column>
            <template v-slot:empty>
              <div class="noData" @click="toDeliverGoods" v-if="orderData.status === 1"><el-button type="primary">去发货</el-button></div>
            </template>
          </el-table>
        </div>
      </div>
      <h3>订单日志</h3>
      <div class="order-log">
        <el-table :data="orderData.logs" style="width: 100%">
          <el-table-column align="center" prop="createTime" label="时间">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userTypeName" label="角色"/>
          <el-table-column align="center" prop="userName" label="操作人"/>
          <el-table-column align="center" prop="operateTypeName" show-overflow-tooltip label="操作事项"/>
        </el-table>
      </div>
    </div>
    <logistics-info ref="logisticsInfoRef"></logistics-info>
    <deliver-goods @reset="reset" ref="deliverGoodsRef"></deliver-goods>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
  }
}
.basic-information {
  .item {
    margin-bottom: 25px;
    display: flex;
    align-items: end;
    span {
      width: 130px;
      display: block;
      text-align: right;
    }
  }
}
</style>
