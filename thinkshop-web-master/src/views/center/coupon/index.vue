<script setup>
import {message} from "ant-design-vue";
import Spin from "@/utils/spin.js";
import {getUserCoupon, redeemCoupons} from "@/api/coupon.js";
import router from "@/router/index.js";
import noDataImg from '@/assets/images/empty/noCoupon.png';
import {formatDateTime} from "@/utils/index.js";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();

const couponType = ref(1);

// 获取优惠券列表
const couponList = ref([])
const total = ref(0)
const loading = ref(false)
function getCouponList() {
  const spinIntance = Spin.service({target: '#loading'});
  loading.value = true
  getUserCoupon(couponType.value).then(res => {
    couponList.value = res.rows;
    total.value = res.total;
    loading.value = false
    spinIntance.close()
  })
}

// 切换类型
function changeType(type) {
  if (couponType.value === type) {
    return
  }
  couponType.value = type
  const couponList = ref([])
  getCouponList()
}

// 兑换优惠券
const couponKey = ref('')
function exchangeCoupon() {
  redeemCoupons(couponKey.value).then(res => {
    message.success(t('coupon.successfulExchange'))
    getCouponList()
  }).catch(() => {
    message.error(t('coupon.conversionFailure'))
  })
}
onMounted(() => {
  getCouponList()
})
</script>
<template>
  <div class="coupon">
    <h3>{{t('coupon.title')}}</h3>
    <div class="coupon-top">
      <div class="coupon-tab" :class="{overlay: loading}">
        <div @click="changeType(1)" class="tab-item" :class="{active: couponType === 1}">{{t('coupon.unused')}}</div>
        <div @click="changeType(2)" class="tab-item" :class="{active: couponType === 2}">{{t('coupon.used')}}</div>
        <div @click="changeType(3)" class="tab-item" :class="{active: couponType === 3}">{{t('coupon.expired')}}</div>
      </div>
      <a-flex class="coupon-exchange">
        <a-input style="border-color: #262626;width: 343px" :placeholder="t('coupon.exchangePlaceholder')" @pressEnter="exchangeCoupon" v-model:value="couponKey">
          <template #suffix>
            <span class="search-btn" @click="exchangeCoupon">{{t('coupon.exchange')}}</span>
          </template>
        </a-input>
      </a-flex>
    </div>
    <div class="coupon-box" id="loading">
      <div class="coupon-list" v-if="couponList.length > 0">
        <div class="coupon-item" :class="{haveBeenUsed: couponType !== 1}" v-for="item of couponList" :key="item.id">
          <div class="item-left">
            <div v-if="item.couponType === 2">
              <div class="discount-amount">{{((10 - item.discount) * 10)}}%{{t('coupon.off')}}</div>
            </div>
            <div v-else class="discount-amount">${{item.couponValue}}</div>
          </div>
          <div class="item-right">
            <div class="coupon-title">{{item.couponName}}</div>
            <div class="coupon-info">{{item.remark}}</div>
            <div class="use-date">
              <div class="date-info">Expires on {{formatDateTime(item.expirationTime)}}</div>
              <div v-if="couponType === 1" class="coupon-btn" @click="(() => router.push('/index'))">{{t('coupon.goToUse')}}</div>
              <div v-else class="coupon-btn">{{couponType === 2 ? t('coupon.haveBeenUsed') : t('coupon.expired')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <a-empty
            :image="noDataImg"
            :description="t('coupon.noCoupon')"
            :image-style="{height: '100px'}">
        </a-empty>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.coupon {
  .coupon-top {
    display: flex;
    justify-content: space-between;
  }
  h3 {
    margin-bottom: 30px;
    font-size: 20px;
  }
  .coupon-tab {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    position: relative;
    .tab-item {
      font-weight: 400;
      font-size: 16px;
      color: #262626;
      height: 44px;
      line-height: 44px;
      cursor: pointer;
      font-weight: 500;
      margin-right: 30px;
    }
    .active {
      color: #262626;
      border-bottom: #262626 solid 2px;
    }
  }
  .overlay:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  .coupon-exchange {
    height: 36px;
    .search-btn {
      padding-left: 10px;
      border-left: #cccccc solid 1px;
      cursor: pointer;
    }
  }
  .coupon-box {
    position: relative;
    .coupon-list {
      width: 100%;
      display: flex;
      flex-flow: wrap;
      .coupon-item {
        width: 486px;
        height: 102px;
        background: #FAFAFA;
        border-left: 4px solid #262626;
        display: flex;
        margin: 0 16px 20px 0;
        overflow: hidden;
        .item-left {
          width: 112px;
          display: flex;
          align-items: center;
          justify-content: center;
          position:relative;
          border: 1px solid #262626;
          border-right: 1px #8C8C8C dashed;
          .discount-amount {
            font-size: 24px;
            color: #262626;
            font-weight: 600;
          }
          .discount-describe {
            font-size: 16px;
            color: #262626;
            font-weight: 600;
          }
        }
        .item-left:after {
          content: '';
          width: 16px;
          height: 16px;
          position: absolute;
          right: -8px;
          top: -8px;
          background: #ffffff;
          border-radius: 50%;
          border: #262626 solid 1px;
        }
        .item-left:before {
          content: '';
          width: 16px;
          height: 16px;
          position: absolute;
          right: -8px;
          bottom: -8px;
          background: #ffffff;
          border-radius: 50%;
          border: #262626 solid 1px;
        }
        .item-right {
          flex: 1;
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid #262626;
          border-left: 0;
          .coupon-title {
            font-weight: 600;
            font-size: 14px;
            color: #262626;
            margin-bottom: 5px;
          }
          .coupon-info {
            font-weight: 400;
            font-size: 12px;
            color: #666666;
            margin-bottom: 12px;
          }
          .use-date {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .date-info {
              font-weight: 400;
              font-size: 12px;
              color: #666666;
            }
            .coupon-btn {
              background: #262626;
              border-radius: 2px 2px 2px 2px;
              width: 55px;
              height: 24px;
              line-height: 24px;
              text-align: center;
              font-weight: 400;
              font-size: 12px;
              color: #FFFFFF;
              cursor: pointer;
            }
          }
        }
      }
      .haveBeenUsed {
        opacity: 0.4;
      }
    }
  }
}
</style>
