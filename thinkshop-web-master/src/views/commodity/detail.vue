<template>
  <div class="product-detail">
    <div class="w-width main-con">
      <div class="info-box">
        <a-flex :gap="40" class="pro-flex">
          <!-- <div class="swiper-cell">
            <div @click="trunPage(-1)" class="swiper-page" v-if="detail.images?.length>3">
              <i class="iconfont icon-xiangshang"/>
            </div>
            <Swiper
              :height="82"
              :space-between="10"
              :freeMode="true"
              direction="vertical"
              :modules="modules"
              autoplay
              @swiper="onSwiper"
              @slideChange="onSlideChange"
            >
              <SwiperSlide v-for="(it, i) in detail.images" :key="i">
                <div :class="['img-box', pageIndex===i?'active':'']" @click="changePage(i)">
                  <img :src="it" class="img"/>
                </div>
              </SwiperSlide>
            </Swiper>
            <div @click="trunPage(1)" class="swiper-page"  v-if="detail.images?.length>3">
              <i class="iconfont icon-xiangxia"/>
            </div>
          </div> -->
          <div class="img-list">
            <div :class="['img-box', pageIndex===i?'active':'']" @click="pageIndex=i" v-for="(it, i) in detail.images" :key="i">
              <img :src="it" class="img"/>
            </div>
          </div>
          <div class="img-cell">
            <img :src="proImg" alt=""/>
          </div>
          <div class="info-cell">
            <p class="p-title">{{detail.productName}}</p>
            <p class="p-title" style="font-size: 22px" v-if="detail.brandName">Brand：{{detail.brandName}}</p>
            <p class="intro">{{detail.introduce}}</p>
            <p class="price">{{currency}}{{formatPrice(sku.price) || formatPrice(detail.minPrice)}}</p>
            <div class="sku" v-if="detail.productAttr&&detail.productAttr.length">
              <div v-for="it in detail.productAttr" :key="it.attrId" class="mb10">
                <p class="sku-name">
                  {{it.attrName}}：
                  <span>{{it.selectAttr}}</span>
                </p>
                <a-flex :gap="10" wrap="wrap">
                  <p
                    v-for="(val, i) in it.attrValueArr"
                    :key="i"
                    :class="['sku-item','cursor-p', 'mb10', val===it.selectAttr?'active':'']"
                    @click="selectSku(it, val)"
                  >
                    {{val}}
                  </p>
                </a-flex>
              </div>
            </div>
            <div class="buy-cell">
              <a-flex justify="space-between" align="center" class="c-box">
                <p>{{$t('commodity.num')}}：</p>
                <p>
                  <span @click="changeNum(-1)">－</span>
                  <span>{{num}}</span>
                  <span @click="changeNum(1)">＋</span>
                </p>
              </a-flex>
              <a-button
                class="s-btn mb20"
                @click="buyProduct(1)"
                :disabled="sku.stock===0"
              >{{$t('commodity.buy')}}</a-button>
              <a-button class="s-btn c-gray" @click="buyProduct(0)">{{$t('commodity.joinCart')}}</a-button>
            </div>
            <div>
              <p class="intro" style="margin: 40px 0 15px">share to</p>
              <share-brands/>
            </div>
          </div>
        </a-flex>
      </div>
      <div class="comment-detail">
        <a-flex :gap="32">
          <p
            v-for="it in tabList"
            :key="it.type"
            :class="['tab-item', it.type===tabType?'active':'']"
            @click="changeTab(it.type)"
          >{{ it.label }}</p>
        </a-flex>
        <div v-html="detail.detail" v-if="tabType==='detail'"/>
        <div class="comment" v-else>
          <div class="comment-item" v-for="item in commentOb.rows">
            <a-flex justify="space-between">
              <p>{{ item.commentUser }}</p>
              <div class="score">
                <span class="sku">{{ item.productSku }}</span>
                <a-rate v-model:value="item.score" :allowHalf="true" :disabled="true"/>
              </div>
            </a-flex>
            <p class="time">{{ item.commentTime }}</p>
            <p class="comment-text">{{ item.comment }}</p>
            <a-flex :gap="10">
              <a-image
                v-for="img in item.imageUrlSet"
                :width="184"
                :src="img"
              />
            </a-flex>
          </div>
          <a-pagination
            @change="onChange"
            :total="commentOb.total"
            v-model:current="page.pageSize"
            :hideOnSinglePage="true"
          />
          <div class="comment-empty" v-if="!commentLoading&&!commentOb.total">
            <img :src="emptyComment"/>
            <p>{{$t('order.noComment')}}~</p>
          </div>
        </div>
      </div>
      <div class="recommend" v-if="recommendList.length">
        <p class="r-title">{{$t('commodity.recommendGood')}}</p>
        <a-flex class="recommend-list">
          <div class="s-page">
            <i class="iconfont icon-xiangzuo" @click="() => {useReSwiper.slidePrev()}"/>
          </div>
          <Swiper
            :slidesPerView="4"
            :spaceBetween="32"
            @swiper="onRecommendSwiper"
          >
            <SwiperSlide v-for="it in recommendList" :key="it.productId">
              <div class="swiper-item" @click="toRouter(it)">
                <img :src="it.images[0]"/>
                <p>{{it.productName}}</p>
                <p class="intro">{{it.introduce}}</p>
                <p>{{currency}}{{formatPrice(it.minPrice)}}</p>
                <p></p>
              </div>
            </SwiperSlide>
          </Swiper>
          <div class="s-page">
            <i class="iconfont icon-xiangyou" @click="() => {useReSwiper.slideNext()}"/>
          </div>
        </a-flex>
      </div>
    </div>
  </div>
</template>

<script setup>
import {productDetail, recommendPro, queryProComment} from '@/api/product'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Controller } from 'swiper/modules';
import {addCart} from '@/api/cart'
import useCommodityStore from '@/store/modules/commodity'
import useSettingStore from '@/store/modules/setting'
import defaultGoodImg from '@/assets/images/default_good.png'
import emptyComment from '@/assets/images/empty_comment.png'

import 'swiper/css'
import {formatPrice} from "@/utils/index.js";
import shareBrands from '@/components/shareBrands/index.vue'
import { TwitterOutlined, FacebookFilled, InstagramFilled,CloseOutlined } from '@ant-design/icons-vue';

const socialIcons = ref([
  { name: 'X', component: CloseOutlined, link: `test?url=${window.location.href}` ,color:'#000'},
  { name: 'Facebook', component: FacebookFilled, link: `test?url=${window.location.href}` ,color:'#264bb5'},
  { name: 'Twitter', component: TwitterOutlined, link: `test?url=${window.location.href}` ,color:'#12b2d6'}, // Assuming the third icon is Twitter
  { name: 'Instagram', component: InstagramFilled, link: `test?url=${window.location.href}` ,color:'#d4398f'},
]);

const router = useRouter()
const useStore = useCommodityStore()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const detail = ref({images: []})
// swiper
const modules = ref([])
const pageIndex = ref(0)
const useSwiper = ref(null)
// 购买量
const num = ref(1)
// 选中的sku
const sku = ref({})
// 选中要展示的产品图
const proImg = ref(defaultGoodImg)
// 推荐好物
const recommendList = ref([])
const useReSwiper = ref(null)
const tabType = ref('detail')
const tabList = shallowRef([
  {label: proxy.$t('order.detail'), type: 'detail'},
  {label: proxy.$t('order.comment'), type: 'comment'},
])
const page = ref({
  pageNum: 1,
  pageSize: 10
})
const commentLoading = ref(false)
const commentOb = ref({rows: [], total: 0})
// 切换产品图
watch(() => pageIndex.value, (val) => {
  proImg.value = detail.value.images[val]
})

// 初始化商品主图swiper
function onSwiper(swiper) {
  useSwiper.value = swiper
}
function onSlideChange(v) {
	pageIndex.value = useSwiper.value.activeIndex
}
// 跳转指定页
function changePage(i) {
  useSwiper.value.slideTo(i)
}
// 上下切换swiperSlide
function trunPage(flag) {
  if(flag===1) {
    useSwiper.value.slideNext()
  } else {
    useSwiper.value.slidePrev();
  }
}
// 推荐好物swiper
function onRecommendSwiper(swiper) {
  useReSwiper.value = swiper
}
// 商品详情
function getDetail() {
  const {params={}} = router.currentRoute?.value
  productDetail(params.productId).then(res => {
    const {image, productAttr, productValue} = res.data
    if(image) res.data.images = image.split(',')
    if(productAttr.length) {
      // 默认选择规格第一个值
      // res.data.productAttr.forEach(it => {
      //   it.selectAttr = it.attrValueArr[0]
      // })
    }
    detail.value = res.data
    initSku()
  })
  // 推荐好物
  recommendPro({productId: params.productId}).then(res => {
    const {rows} = res
    if(rows.length) {
      rows.forEach(it => {
        it.images = it.image.split(',')
      })
    }
    recommendList.value = rows
  })
}
// 商品评价
function getCommentList() {
  const {params={}} = router.currentRoute?.value
  commentLoading.value = true
  queryProComment(params.productId, page.value).then(r => {
    commentOb.value = {
      rows: r.rows,
      total: r.total
    }
    commentLoading.value = false
  })
}
function onChange(page, pageSize) {
  page.value = {
    pageNum: page,
    pageSize
  }
  getCommentList()
}
function changeTab(type) {
  if(tabType.value!==type) {
    page.value = {
      pageNum: 1,
      pageSize: 10
    }
    commentOb.value = {rows: [], total: 0}
    if(type==='comment') {
      getCommentList()
    }
  }
  tabType.value = type

}
/* ---下单和加购物车--- */
// 计算选中的sku
function initSku() {
  const {productAttr, productValue, images} = detail.value
  const selectSku = productAttr.map(it => it.selectAttr).join(',')
  sku.value = productValue[selectSku] || {}
  // 选中规格里的产品图
  proImg.value = sku.value.image || images[pageIndex.value] || ''
}
// 选择sku
function selectSku(it, val) {
  // 选择及取消sku
  it.selectAttr = it.selectAttr===val?'':val
  initSku()
}
// 选择商品数量
function changeNum(v) {
  // 至少选购一件商品
  if(num.value===1&&v==-1) return
  // 选购商品数不能超过库存
  if(num.value>=sku.value.stock&&v==1) return
  if(v>0) num.value++
  if(v<0) num.value--
}
// 立即购买or添加购物车
function buyProduct(isNew) {
  const {productId} = detail.value
  const params = {
    productId,
    num: num.value,
    skuId: sku.value.skuId,
    isNew
  }
  if(!sku.value.skuId) return proxy.$message.warning(proxy.$t('commodity.skuTip'))
  addCart(params).then(r => {
    if(!isNew) {
      proxy.$message.success(proxy.$t('commodity.joinSuc'))
      // 更新购物车数量
      useStore.getCart()
    } else {
      router.push({path:'/shopping', query: {cartIds: r.data}})
    }
  })
}
// 好物详情
function toRouter(it) {
  router.push(`/product-detail/${it.productId}`)
}


getDetail()
</script>

<style scoped lang="scss">
.main-con {
  margin: 0 auto;
  .mb20 {
    margin-bottom: 20px;
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .info-box {
    padding: 32px 0;
    border-bottom: 1px #E5E5E5 solid;
    .pro-flex {
      justify-content: center;
    }
    .swiper-cell {
      width: 74px;
      height: 400px;
      .swiper-page {
        height: 24px;
        line-height: 24px;
        text-align: center;
        .iconfont {
          font-size: 24px;
        }
      }
      .swiper {
        height: 352px;
      }
      .img-box {
        padding: 4px;
        box-sizing: border-box;
        &.active {
          border: 1px solid #000000;
        }
        .img {
          width: 66px;
          height: 82px;
        }
      }
    }
    .img-list {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      height: 400px;
      overflow: scroll;
      .img-box {
        padding: 4px;
        box-sizing: border-box;
        &.active {
          border: 1px solid #000000;
        }
        .img {
          width: 66px;
          height: 82px;
        }
      }
      &::-webkit-scrollbar {
        width: 0;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .img-cell {
      width: 354px;
      height: 400px;
      img {
        width: 354px;
        height: 100%;
        object-fit: cover;
      }
    }
    .info-cell {
      width: 500px;
      .p-title {
        font-size: 24px;
        margin-bottom: 4px;
      }
      .intro {
        font-size: 16px;
        color: #939599;
      }
      .price {
        font-size: 18px;
        font-weight: 600;
        margin: 16px 0;
      }
      .sku {
        .sku-name {
          color: #8C8C8C;
          font-size: 14px;
          margin-bottom: 8px;
          span {
            color: #262626;
          }
        }
        .sku-item {
          height: 32px;
          line-height: 32px;
          border: 1px solid #8C8C8C;
          border-radius: 2px;
          color: #8C8C8C;
          font-size: 12px;
          padding: 0 20px;
          &.active {
            background: #262626;
            border: none;
            color: #FFFFFF;
          }
        }
      }
      .buy-cell {
        // width: 400px;
        .c-box {
          margin-bottom: 24px;
          height: 35px;
          font-size: 12px;
          p {
            font-size: 14px;
            color: #939599;
            &:nth-of-type(2) {
              border-radius: 2px;
              border: 1px #262626 solid;
              padding: 8px;
              span {
                font-size: 12px;
                &:first-child, &:last-child {
                  font-size: 16px;
                  display: inline-block;
                  height: 16px;
                  width: 16px;
                  text-align: center;
                  line-height: 16px;
                  border-radius: 50%;
                  background: #F5F5F5;
                  color: #A9A9B2;
                  &:hover {
                    cursor: pointer;
                  }
                }
                &:last-child {
                  background: #262626;
                  color: #FFFFFF;
                }
                &:nth-child(2) {
                  padding: 0 30px;
                  color: #8C8C8C;
                }
              }
            }
          }
        }
      }
    }
  }
  .comment-detail {
    padding-top: 24px;
    .tab-item {
      font-weight: 600;
      font-size: 16px;
      padding-bottom: 9px;
      cursor: pointer;
      margin-bottom: 32px;
      &.active {
        border-bottom: 2px #262626 solid;
      }
    }
    .comment {
      .comment-item {
        font-size: 14px;
        padding-bottom: 32px;
        border-bottom: 1px  #E5E5E5 solid;
        &:last-child {
          border: none;
        }
        .score {
          .sku {
            margin-right: 30px;
          }
        }
        .time {
          margin-top: 4px;
          font-size: 12px;
          color: #8C8C8C;
        }
        .comment-text {
          font-size: 14px;
          margin: 24px 0 16px;
        }
      }
      .comment-empty {
        text-align: center;
        padding: 100px 0;
        img {
          width: 100px;
          height: 100px;
        }
        p {
          font-size: 14px;
          color: #8C8C8C;
        }
      }
    }
  }
  .recommend {
    margin: 80px 0;
    .r-title {
      font-size: 36px;
      color: #262626;
      margin-bottom: 32px;
      text-align: center;
    }
    .recommend-list {
      .swiper {
        width: calc(100% - 100px);
      }
      .swiper-item {
        img {
          width: 100%;
          height: 320px;
          margin-bottom: 8px;
          object-fit: contain;
        }
        p {
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          &:nth-of-type(1) {
            font-size: 18px;
            margin-bottom: 4px;
          }
          &.intro {
            font-weight: 400;
            color: #939599;
            margin-bottom: 4px;
          }
        }
      }
      .s-page {
        line-height: 320px;
        .iconfont {
          font-size: 20px;
        }
      }
    }
  }
}
.social-icons {
  display: flex;
  justify-content: left;
  gap: 24px;
  a {
    font-size: 24px;
    color: #fff;
    background-color: #D4398F;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
