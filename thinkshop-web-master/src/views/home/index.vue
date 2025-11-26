<template>
  <div class="p-home">
    <div class="main-con w-width">
      <div class="comp-box" v-for="it in homeList" :key="it.name">
        <!-- banner -->
        <Swiper
          v-if="it.name==='banners'"
          :modules="modules"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
        >
          <SwiperSlide v-for="child in it.config" :key="child.id">
            <div class="s-banner">
              <img alt="" :src="child.imageUrl" @click="toRouter(child)"/>
            </div>
          </SwiperSlide>
        </Swiper>
        <!-- 1左图右文 2左文右图 -->
        <div class="img-text-box" v-if="it.name==='imageAndTexts'">
          <div class="img-text" v-for="child in it.config" :key="child.id">
            <a-flex :gap="16" :class="[child.type===2?'text-img':'']">
              <div class="img-cell">
                <img alt="" :src="child.resourceUrl"/>
              </div>
              <div class="text-box">
                <p>{{child.title}}</p>
                <p>{{child.introduction}}</p>
                <a-button class="s-btn" @click="toRouter(child)">{{$t('layout.quickBuy')}}</a-button>
              </div>
            </a-flex>
          </div>
        </div>
        <!-- 商品分组 -->
        <div class="com-group-box" v-if="it.name==='productGroupInfo'">
          <div class="com-group" v-for="child in it.config" :key="child.id">
            <div class="group-head">
              <p>{{child.name}}</p>
              <p>{{child.remark}}</p>
              <p><span @click="toRouter(child)">{{$t('layout.viewMore')}}</span></p>
            </div>
            <div class="group-list">
              <a-flex :gap="24">
                <div class="l-item" v-for="pro in child.productDetail" :key="pro.productId" @click="toRouter(pro)">
                  <img :src="formatImg(pro.image)" alt=""/>
                  <p class="c-name text-overflow">{{pro.productName}}</p>
                  <p class="sub-name text-overflow">{{pro.introduce}}</p>
                  <p class="price">
                    <span>{{currency}}{{formatPrice(pro.minPrice)}}</span>
                    <span>{{currency}}{{formatPrice(pro.maxPrice)}}</span>
                  </p>
                </div>
              </a-flex>
            </div>
          </div>
        </div>
        <!-- 视频 -->
        <div class="c-video-box" v-if="it.name==='videos'">
          <div class="c-video" v-for="child in it.config" :key="child.id">
            <div class="group-head">
              <p>{{child.title}}</p>
              <p>{{child.introduction}}</p>
              <p @click="toRouter(child)"><span>{{$t('layout.viewMore')}}</span></p>
            </div>
            <c-video :src="child.resourceUrl"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getHomeDesign} from '@/api/login'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Autoplay, Pagination } from 'swiper/modules'
import { formatPrice } from "@/utils/index.js";
import 'swiper/swiper-bundle.css'
import CVideo from '@/components/CVideo.vue'
import useSettingStore from '@/store/modules/setting'

const router = useRouter()

// 货币单位
const currency = ref(useSettingStore().global.currencySymbol || '')
const modules = ref([Autoplay, Pagination])
const homeList = ref([])
// 组件跳转
function toRouter(item) {
  const {productId, groupId, redirectUrl} = item
  let query ={}
  let path = redirectUrl
  if(productId) path = `/product-detail/${productId}`
  if(groupId) {
    path = '/product-list'
    query = {
      groupId
    }
  }
  if(productId || groupId) {
    router.push({path, query})
  } else {
    window.open(path, '_self')
  }
}
// 首页配置
function getHomeSetting() {
  getHomeDesign().then(r => {
    const {data} = r
    homeList.value = Object.keys(data).reduce((list, name) => {
      let config = data[name]
      // 分组商品展示4条商品
      if(name==='productGroupInfo') {
        config.forEach(it => {
          it.productDetail = it.productDetail.slice(0, 4)
        })
      }
      list.push({name, config})
      return list
    }, [])
  })
}
// 格式产品图
function formatImg(imgs) {
  if(!imgs) return ''
  return imgs.split(',')[0]
}

getHomeSetting()
</script>

<style lang="scss" scoped>
.p-home {
  .main-con {
    margin: 0 auto 100px;
  }
  .s-banner {
    height: 540px;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .img-text-box {
    .img-text {
      margin-top: 64px;
      :deep(.text-img) {
        flex-direction: row-reverse;
      }
      .text-box, .img-cell {
        height: 390px;
        // flex: 1;
        width: 50%;
      }
      .img-cell {
        text-align: center;
        img {
          height: 100%;
          width: max-content;
        }
      }
      .text-box {
        padding: 115px 100px 0 84px;
        box-sizing: border-box;
        p {
          font-size: 24px;
          margin-bottom: 4px;
          &:nth-child(2) {
            font-size: 16px;
            color: #939599;
            margin-bottom: 16px;
          }
        }
        .s-btn {
          width: 200px;
        }
      }
    }
  }
  .c-video {
    margin-top: 100px;
  }
  .group-head {
    margin-bottom: 32px;
    p {
      font-size: 16px;
      text-align: center;
      span {
        text-decoration: underline;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(1) {
        font-size: 36px;
        margin-bottom: 4px;
      }
      &:nth-child(2) {
        font-size: 16px;
        color: #939599;
        margin-bottom: 16px;
      }
    }
  }
  .com-group {
    margin-top: 100px;
    .group-list {
      .l-item {
        width: 25%;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
        img {
          height: 320px;
          // width: 100%;
          width: min-content;
          margin-bottom: 8px;
        }
        p {
          text-align: center;
        }
        .c-name {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 4px;
        }
        .sub-name {
          font-size: 14px;
          color: #939599;
          margin-bottom: 4px;
        }
        .price {
          font-size: 14px;
          color: #939599;
          span:first-child {
            font-weight: 600;
            font-size: 14px;
            color: #262626;
            margin-right: 4px;
          }
        }
        &:hover {
          position: relative;
          &::before {
            content: '';
            display: block;
            position: absolute;
            height: 4px;
            width: 100%;
            background: #262626;
            left: 0;
            top: 318px;
          }
          // img {
          //   border-bottom: 4px #262626 solid;
          //   box-sizing: border-box;
          // }
        }
      }
    }
  }
}
</style>
