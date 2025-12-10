<template>
  <div class="product-detail">
    <div class="w-width main-con">
      <div class="info-box">
        <h1 class="p-title">{{detail.title}}</h1>
        <p class="p-time">{{formatDateTime(detail.createTime)}}</p>
      </div>
      <div class="comment-detail">
        <div v-html="decodeURIComponent(detail.content)"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {formatDateTime} from "@/utils/index.js";
import {newsDetail} from '@/api/home'
import useCommodityStore from '@/store/modules/commodity'
import useSettingStore from '@/store/modules/setting'

import 'swiper/css'

const router = useRouter()
const useStore = useCommodityStore()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const detail = ref([])

// 商品详情
function getDetail() {
  const {params={}} = router.currentRoute?.value
  newsDetail(params.newsId).then(res => {
    detail.value = res.data
  })
}

getDetail()
</script>

<style scoped lang="scss">
.main-con {
  margin: 0 auto;
  .info-box {
    padding: 32px 0;
    border-bottom: 1px #E5E5E5 solid;
    .p-title {
      font-size: 24px;
      margin-bottom: 4px;
      text-align: center;
    }
    .p-time{
      font-size: 15px;
      margin-bottom: 4px;
      text-align: center;
    }
  }
  .comment-detail {
    padding-top: 24px;
    margin-left: 48px;
    margin-right: 48px;
  }
}
</style>
