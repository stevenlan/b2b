<script setup>
import {getCouponData} from "@/api/coupon/index.js";
import { ElMessage } from 'element-plus'

const visible = ref(false) // 显示隐藏
const infoData = ref({}); // 商品使用数据

// 显示优惠券数据
const loading = ref(true)
function showCouponData(id) {
  visible.value = true
  getCouponData(id).then((res) => {
    infoData.value = res.data
    loading.value = false
  }).catch(() => {
    ElMessage.error(res.message)
  })
}
defineExpose({
  showCouponData
})
</script>

<template>
  <!-- 数据展示 -->
  <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      title="数据效果"
      width="1000px"
      top="50px"
  >
    <!-- 表格 -->
    <div class="coupon-data" v-loading="loading">
      <h3>数据统计至昨日</h3>
      <div class="coupon-tit">优惠券名称：{{ infoData.couponName }}</div>
      <div class="coupon-tit">
        优惠券总数：{{
          infoData.receiveNumber + infoData.residueNumber
        }}
        张，已领取 {{ infoData.receiveNumber ? infoData.receiveNumber : '0' }} 张
      </div>
      <div class="list-box">
        <div class="data-item">
          <p>领取人数</p>
          <span>{{ infoData.receivePerson }}</span>
        </div>
        <div class="data-item">
          <p>已发放数</p>
          <span>{{ infoData.receiveNumber }}</span>
        </div>
        <div class="data-item">
          <p>剩余数量</p>
          <span>{{ infoData.residueNumber }}</span>
        </div>
        <div class="data-item">
          <p>用券成交总额</p>
          <span>{{ infoData.totalAmount }}</span>
        </div>
        <div class="data-item">
          <p>使用优惠券总额</p>
          <span>{{ infoData.totalCouponAmount }}</span>
        </div>
        <div class="data-item">
          <p>购买商品总数</p>
          <span>{{ infoData.totalNumber }}</span>
        </div>
        <div class="data-item">
          <p>商品用券平均额度</p>
          <span>{{ infoData.averageCouponAmount }}</span>
        </div>
      </div>
      <div class="tab-list-info">使用该券购买的商品</div>
      <div class="table-box">
        <el-table
            :data="infoData.details"
            :header-cell-style="{ background: '#F5F6FA', color: '#262626' }"
            tooltip-effect="dark"
            style="width: 100%"
        >
          <el-table-column
              prop="productName"
              label="商品名称"
              show-overflow-tooltip
          />
          <el-table-column
              prop="number"
              label="付款件数"
              show-overflow-tooltip
          />
          <el-table-column
              prop="person"
              label="付款人数"
              show-overflow-tooltip
          />
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.coupon-data {
  h3 {
    font-weight: 400;
    font-size: 14px;
    color: #262626;
  }
  .coupon-tit {
    margin: 10px 0;
    font-weight: 400;
    font-size: 14px;
  }
  .list-box {
    display: flex;
    margin: 30px 0;
    flex-wrap: wrap;
    .data-item {
      width: 162px;
      height: 87px;
      border-radius: 8px;
      background: #F5F6FA;
      padding: 16px;
      margin: 0 16px 16px 0;
      span {
        display: block;
        margin: 8px 0;
        font-weight: bold;
      }
    }
  }
  .tab-list-info {
    margin: 20px 0;
  }
}
</style>
