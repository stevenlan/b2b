<template>
  <div class="pay">
    <p class="title">{{$t('commodity.payType')}}</p>
    <p class="no">{{$t('commodity.tradeNo')}}：</p>
    <a-flex :gap="32" class="card-list">
      <div :class="['s-card', 'cursor-p', payMethod===it.code?'active':''] " v-for="it in payList" :key="it.id" @click="selectPay(it)">
        <img :src="it.logo"/> {{it.name}}
      </div>
    </a-flex>
    <div class="stripe"  v-show="payMethod==='stripe'">
      <div id="payment-element"/>
    </div>
  </div>
</template>

<script setup>
import {payConfig, payOrder} from '@/api/shopping'

const {proxy} = getCurrentInstance()
const props = defineProps({
  query: {
    type: Object,
    default: () => {}
  },
  orderRule: {
    type: Object,
    default: () => {}
  }
})

const payList = ref([])
const payMethod = ref('')
const paySuccessUrl = ref('')
// stripe支付
const striptOb = ref({})

// 实例化stripe
function initStripe(pkId, clientSecret) {

  const stripe = window.Stripe(pkId)
  const options = {
    clientSecret,
    appearance: {},
  }
  const elements = stripe.elements(options);

  // Create and mount the Payment Element
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
  striptOb.value = {
    stripe,
    elements
  }
}
// stripe支付
async function stripePay() {
  const {stripe, elements} = striptOb.value
  const {pcUrl} = props.orderRule
  const {error} = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${pcUrl}/#/shopping?orderId=${props.query.orderId}`
    }
  })
  if(error) {
    proxy.$message.error(error.message)
  }
}
// 获取支付方式
function getPayList() {
  payConfig().then(r => {
    const {data} = r
    payList.value = data
    data.forEach(it => {
      setPay(it)
    })
  })
}
// 初始化支付数据、实例化stripe支付
function setPay(it) {
  const {code, clientId} = it
  payOrder({orderId: props.query.orderId, payMethod: code}).then(r => {
    const {payUrl} = r.data
    if(code==='stripe') {
      initStripe(clientId, payUrl)
    } else {
      paySuccessUrl.value = payUrl
    }
  })
}
// 选择支付方式
function selectPay(it) {
  const {code} = it
  payMethod.value = code
}
// 提交支付
function toPay() {
  if(!payMethod.value) return proxy.$message.warn(proxy.$t('commodity.payTip'))
  if(!paySuccessUrl.value) return proxy.$message.warn(proxy.$t('commodity.paying'))
  if(payMethod.value==='stripe') stripePay()
  if(payMethod.value==='paypal') window.open(paySuccessUrl.value)
}

defineExpose({toPay})

getPayList()
</script>

<style scoped lang="scss">
.pay {
  .title {
    font-weight: 600;
    font-size: 16px;
  }
  .no {
    font-size: 12px;
    color: #8C8C8C;
    margin: 4px 0 32px;
  }
  .card-list {
    .s-card {
      flex: 1;
      height: 60px;
      line-height: 60px;
      border-radius: 2px;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      border: 1px  #E5E5E5 solid;
      img {
        width: 30px;
        height: 30px;
      }
      &:hover {
        cursor: pointer;
      }
      &.active {
        border-color: #262626;
      }
    }
  }
  .stripe {
    margin-top: 40px;
  }
}
</style>