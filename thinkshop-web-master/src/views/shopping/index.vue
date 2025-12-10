<template>
  <div class="shopping">
    <div class="w-width main-con">
      <a-flex :gap="40">
        <div class="l-p">
          <div class="tab-box">
            <a-flex :gap="24">
              <div v-for="(it, i) in tabList"
                  :key="i"
                  :class="['tab-item', it.isFinish?'active':'']">
                {{i+1}}.{{it.label}}
              </div>
            </a-flex>
          </div>
          <component :is="tabList[tabIndex].comp"
                    ref="compRef"
                    :preOrder="preOrder"
                    :order-rule="orderRule"
                    @reload="queryPreOrder"
                    :query="query"
                    :preLoading="preLoading"/>
        </div>
        <div class="r-p"
            v-if="tabIndex!==2">
          <p class="title">{{$t('commodity.orderInfo')}}</p>
          <ul>
            <li v-for="(it ,i) in countList"
                :key="i">
              <a-flex justify="space-between">
                <p>{{it.label}}</p>
                <p><span v-if="it.showUnit">{{currency}}</span> {{formatPrice(it.value)}}</p>
              </a-flex>
            </li>
          </ul>
          <a-button class="s-btn"
                    @click="clickSubmit">
            {{btnText}}
          </a-button>
        </div>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import Order from './order.vue'
import Pay from './pay.vue'
import Complete from './complete..vue'
import { preShopInfo, queryOrderInfo, orderConfig } from '@/api/shopping'
import useSettingStore from '@/store/modules/setting'
import {formatPrice} from "@/utils/index.js";

const route = useRoute()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const query = ref(route.query)
const compRef = ref(null)
// 下单前的订单信息
const preOrder = ref({})
const preLoading = ref(false)
// 订单详情
const orderInfo = ref({})
// 支付计时器
const payTimer = ref(null)
// 订单心跳
const orderTimer = ref(null)
// 剩余支付时间
const remainTime = ref('')
const orderRule = ref({})

// 订单摘要
const countList = computed(() => {
  const { orderId } = query.value
  const info = orderId ? orderInfo.value : preOrder.value
  return [
    { label: ft('orderSum'), value: `${ft('selected')}${info.totalNum || 0}${ft('goodNum')}` },
    { label: ft('tPrice'), value: info.totalPrice || 0, showUnit: false},
    { label: ft('salePro'), value: info.couponPrice || 0, showUnit: false },
    { label: ft('toOffset'), value: info.integralDeduct || 0, showUnit: false },
    { label: ft('poster'), value: info.totalPostage || 0, showUnit: false },
    { label: ft('tax'), value: info.taxation || 0 },
    { label: ft('realPrice'), value: info.payPrice || 0, showUnit: false }
  ]
})
// 下单状态
const tabIndex = ref(2)
// 下单步骤
const tabList = computed(() => {
  // status: 0(待付款) 1(待发货) 2(待收货) 3(已完成)
  const { status = 0 } = orderInfo.value
  return [
    { label: ft('toRoder'), comp: Order, isFinish: true },
    { label: ft('pay'), comp: Pay, isFinish: !!status },
    { label: ft('paySuceess'), comp: Complete, isFinish: !!status }
  ]
})
// 提交按钮text
const btnText = computed(() => {
  if (tabIndex.value === 0) return ft('subOrder')
  if (tabIndex.value) {
    let t = ''
    if (remainTime.value) t = ` (${remainTime.value})`
    return ft('quiclPay') + t
  }
})

watch(() => route.query, (val) => {
  query.value = val
  init(val)
}, { deep: true })

function ft(field) {
  return proxy.$t(`commodity.${field}`)
}
// 格式化时分秒
function secondsToHms (sec) {
  var hours = Math.floor(sec / 3600);
  var minutes = Math.floor((sec % 3600) / 60);
  var seconds = sec % 60;
  return [hours, minutes, seconds]
    .map(num => num < 10 ? '0' + num : num)
    .filter(Boolean)
    .join(':');
}

// 刷下剩余时间
function getRemainTime () {
  const { orderCancelHour } = orderRule.value
  const { createTime } = orderInfo.value
  // 系统设置的支付时间限制
  const sysPayTime = orderCancelHour || 1
  // 已创建订单时间
  const passSec = parseInt((new Date().getTime() - createTime) / 1000)
  // 已超时支付
  if (passSec > sysPayTime * 3600) {
    clearInterval(payTimer.value)
    return
  }
  // 剩余时间、秒
  const s = sysPayTime * 3600 - passSec
  remainTime.value = secondsToHms(s)
}
// 清除定时器、心跳
function clearTimer () {
  clearInterval(payTimer.value)
  clearInterval(orderTimer.value)
  orderTimer.value = null
}
// 查询下单前的订单信息
function queryPreOrder (ob = {}) {
  const { cartIds } = query.value
  const { couponId = '' } = ob
  const params = {
    cartIds: cartIds.split(','),
    type: 0,
    isDefaultCoupon: couponId ? 0 : 1
  }
  Object.assign(params, ob)
  preLoading.value = true
  preShopInfo(params).then(r => {
    const { data } = r
    preLoading.value = false
    data.couponPrice = data.discountAmount
    preOrder.value = r.data
  })
}
// 订单规则配置
function getOrderConfig () {
  orderConfig().then(r => {
    orderRule.value = r.data
  })
}
// 查询订单信息
function getOrderInfo (used = false) {
  const { orderId } = query.value
  queryOrderInfo(orderId).then(r => {
    const { status } = r.data
    orderInfo.value = r.data
    if (status === 0) {
      if (!used) payTimer.value = setInterval(getRemainTime, 1000)
    } else {
      tabIndex.value = 2
      clearTimer()
      // 支付完成，清除清除定时器
    }
  })
}
// 提交订单和付款
function clickSubmit () {
  if (tabIndex.value === 0) compRef.value.submit()
  if (tabIndex.value === 1) {
    compRef.value.toPay()
    // 支付时，心跳检测订单状态
    if (!orderTimer.value) orderTimer.value = setInterval(() => { getOrderInfo(true) }, 5000)
  }
}

function init () {
  const { cartIds } = query.value
  tabIndex.value = cartIds ? 0 : 1
  if (cartIds) {
    queryPreOrder()
  } else {
    getOrderInfo()
  }
  getOrderConfig()
}

// 清除定时器
onBeforeUnmount(() => {
  clearTimer()
})

init()
</script>

<style scoped lang='scss'>
.shopping {
  .main-con {
    margin: 32px auto;
    min-width: 1100px;
    padding-bottom: 30px;
    .l-p {
      flex: 1;
      .tab-box {
        margin-bottom: 24px;
        .tab-item {
          flex: 1;
          font-size: 16px;
          border-bottom: 2px #8c8c8c solid;
          color: #8c8c8c;
          padding-bottom: 8px;
          &.active {
            border-color: #262626;
            color: #262626;
          }
        }
      }
    }
    .r-p {
      width: 360px;
      padding: 16px;
      background: #fafafa;
      border-radius: 2px;
      height: fit-content;
      .title {
        margin-bottom: 24px;
        font-weight: 600;
        font-size: 16px;
      }
      ul {
        li {
          p {
            font-size: 14px;
          }
          &:nth-child(n + 2) {
            margin-bottom: 8px;
          }
          &:first-child,
          &:nth-child(5) {
            padding-bottom: 24px;
            margin-bottom: 24px;
            border-bottom: 1px #e5e5e5 solid;
          }
          &:last-child {
            margin-bottom: 24px;
          }
        }
      }
    }
  }
}
</style>
