<template>
  <div class="complete-con">
    <img :src="successIcon" alt=""/>
    <p class="r-text">{{$t('commodity.payComp')}}</p>
    <p class="s-text">{{$t('commodity.waitDeliver')}}</p>
    <a-button class="s-btn" @click="toRouter('orderInfo')">{{$t('commodity.lookOrder')}}</a-button>
    <a-button class="s-btn" @click="toRouter()">{{$t('commodity.continueBuy')}}</a-button>
  </div>
</template>

<script setup>
import successIcon from '@/assets/images/pay_success.png'

const router = useRouter()
const props = defineProps({
  query: {
    type: Object,
    default: () => {}
  }
})

function toRouter(type) {
  const path = type==='orderInfo'?`/order-detail?id=${props.query.orderId}`:'/index'
  router.push(path)
}
</script>

<style scoped lang="scss">
.complete-con {
  padding-top: 130px;
  text-align: center;
  img {
    width: 50px;
    height: 50px;
    margin-bottom: 16px;
  }
  .r-text {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 6px;
  }
  .s-text {
    font-size: 14px;
    color: #8C8C8C;
    margin-bottom: 12px;
  }
  .s-btn {
    height: 32px;
    width: auto;
    box-sizing: border-box;
    font-size: 12px;
    &:nth-of-type(1) {
      border:1px #262626 solid;
      color:#262626;
      background: #FFFFFF;
      margin-right: 12px;
    }
  }
}
</style>