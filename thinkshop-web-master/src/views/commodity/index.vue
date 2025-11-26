<template>
  <div class="p-commodity w-width">
    <div class="main-con">
      <a-flex justify="space-between" align="center" class="mb30" v-if="!groupPathId">
        <div class="l-title">
          <span v-if="queryParams.productName" class="k-text">{{queryParams.productName}}</span>
          <span :class="['s-text', queryParams.productName?'m-text':'']">{{tip}}</span>
        </div>
        <div>
          <span class="s-text">{{$t('commodity.sort')}}：</span>
          <a-select
            :options="sortOpt"
            v-model:value="queryParams.sort"
            :bordered="false"
            :dropdownStyle="{width: '140px', fontSize: '16px'}"
            :dropdownMatchSelectWidth="false"
            @change="()=>{queryProduct()}"
          />
        </div>
      </a-flex>
      <div v-else class="group-cell">
        <p>{{groupInfo.name}}</p>
        <p>{{groupInfo.remark}}</p>
      </div>
      <div class="product-list">
        <a-flex :gap="32" wrap="wrap">
          <div class="p-item" v-for="it in productOb.rows" :key="it.productId" @click="toDetail(it)">
            <img :src="it.image" class="img"/>
            <p class="text-overflow">{{it.productName}}</p>
            <p class="intro text-overflow">{{it.introduce}}</p>
            <p><span>{{currency}}</span>{{formatPrice(it.minPrice)}}</p>
          </div>
        </a-flex>
      </div>
      <div class="empty" v-if="!productOb.total&&!loading">
        <img :src="emptyIcon"/>
        <p>{{$t('commodity.noCom')}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {productList, queryGroupInfo} from '@/api/product'
import emptyIcon from '@/assets/images/empty_good.png'
import useSettingStore from '@/store/modules/setting'
import {formatPrice} from "@/utils/index.js";

const router = useRouter()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const defaultParams = {
  pageSize: 20,
  pageNum: 1,
  categoryId: '',
  productName: '',
  groupId: '',
  sort: 0
}
const queryParams = reactive({...defaultParams})
const categoryPath = ref('')
const groupPathId = ref('')
const groupInfo = ref({})
const sortOpt = ref([
  {label: transFn('recommend'), value: 0},
  {label: transFn('new'), value: 1},
  {label: transFn('saleAsc'), value: 2},
  {label: transFn('saleDes'), value: 3},
  {label: transFn('priceAsc'), value: 4},
  {label: transFn('priceDes'), value: 5}
])
const productOb = ref({
  total: 0,
  rows: []
})
const loading = ref(false)

const tip = computed(() => {
  let r = categoryPath.value
  if(queryParams.productName) r = `${transFn('total')}${productOb.value.total}${transFn('results')}`
  return r
})

// 监听分类路由变化，刷新商品分类数据
watch(() => router.currentRoute.value, (val) => {
  categoryPath.value = ''
  productOb.value = {total: 0, rows: []}
  Object.assign(queryParams, defaultParams)
  queryProduct()
})

function transFn(field) {
  return proxy.$t(`commodity.${field}`)
}
// 获取商品列表
function queryProduct(isPage) {
  const {query} = router.currentRoute?.value
  const {key='', categoryId='', fullPath='', groupId} = query || {}
  Object.assign(queryParams, {
    productName: decodeURIComponent(key),
    categoryId,
    groupId
  })
  if(fullPath) categoryPath.value = decodeURIComponent(fullPath)
  if(groupId) groupPathId.value = groupId
  loading.value = true
  productList(queryParams).then(res => {
    let {rows, total} = res
    rows.forEach(it => {
      it.image = it.image.split(',')[0]
    })
    loading.value = false
    // 滚动翻页
    if(isPage) {
      queryParams.pageNum++
      rows = [...productOb.value.rows, ...rows]
    }

    productOb.value = {total,  rows}
  })
}
// 分组详情
function getGroupDetail() {
  if(groupPathId.value) {
    queryGroupInfo(groupPathId.value).then(r => {
      groupInfo.value = r.data
    })
  }
}
// 页面滚动
function handleScroll() {
  let scrollHeight = document.documentElement.scrollHeight;
  let clientHeight = window.innerHeight;
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop + clientHeight + 100 >= scrollHeight) {
      const {rows, total} = productOb.value
      if(!loading.value && rows.length < total) {
        queryProduct(true)
      }
  }
}
// 跳转商详
function toDetail(it) {
  router.push(`/product-detail/${it.productId}`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})


queryProduct()
getGroupDetail()
</script>

<style scoped lang="scss">
.p-commodity {
  margin: 0 auto;
  padding: 30px 0;
  .s-text {
    font-size: 12px;
    color: #8C8C8C;
  }
  .mb30 {
    margin-bottom: 30px;
  }
  .l-title {
    .m-text {
      font-size: 14px;
    }
    .k-text {
      font-size: 20px;
      color: #262626;
      margin-right: 8px;
    }
  }
  .group-cell {
    p {
      text-align: center;
      &:nth-child(1) {
        font-size: 20px;
      }
      &:nth-child(2) {
        font-size: 14px;
        color: #8C8C8C;
        margin: 4px 0 24px;
      }
    }
  }
  .product-list {
    .p-item {
      width: calc(25% - 24px);
      border-radius: 4px;
      .img {
        height: 320px;
        width: 100%;
        margin-bottom: 8px;
      }
      p {
        font-weight: 600;
        font-size: 14px;
        text-align: center;
        margin-bottom: 0;
        &:nth-of-type(1) {
          font-size: 18px;
          margin-bottom: 4px;
        }
        &.intro {
          color: #939599;
          margin-bottom: 4px;
          font-weight: 400;
        }
      }
    }
  }
  .empty {
    text-align: center;
    margin-top: 40px;
    img {
      width: 100px;
      height: 100px;
      margin-bottom: 4px;
    }
    p {
      font-size: 14px;
      color: #8C8C8C;
    }
  }
}
</style>
