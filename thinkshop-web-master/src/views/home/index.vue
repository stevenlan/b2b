<template>
  <div class="p-home">
    <div class="main-con w-width">
      <div v-if="bannerList" class="banner">
        <img :src="bannerList[0].imageUrl" @click="toRouter(bannerList[0])" style="width: 70%;"/>
        <div class="column2">
          <template  v-for="(item,index) in bannerList" :key="index">
            <img v-if="index > 0" :src="item.imageUrl" @click="toRouter(item)" style="height: 49%; width: 100%;"/>
          </template>
        </div>
      </div>
      <category @taps="toRouter"/>
      <arrivals @taps="toRouter"/>
<!--      <img class="bigLogo" src="/src/assets/images/common/bigLogo.png"/>-->
      <div class="comp-box" v-for="it in homeList" :key="it.name">
        <!-- 视频 -->
        <div class="c-video-box" v-if="it.name==='videos'">
          <div class="c-video" v-for="child in it.config" :key="child.id">
            <div class="group-head">
<!--              <p>{{child.title}}</p>-->
<!--              <p>{{child.introduction}}</p>-->
              <c-video :src="child.resourceUrl"/>
<!--              <p @click="toRouter(child)"><span>{{$t('layout.viewMore')}}</span></p>-->
              <a-button class="view-detail-btn" @click="toRouter(child)">
                {{ $t('layout.viewMore') }} <ArrowRightOutlined />
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <sellers @taps="toRouter"/>
      <brands @taps="toRouter"/>
      <psay @taps="toRouter"/>
      <news @taps="toRouter"/>
      <div class="newsletter-box">
        <h2 class="section-title">{{$t('home.newsletterTitle')}}</h2>
        <p class="section-description">{{$t('home.newsletterDesc')}}</p>
        <div class="subscription-form">
          <a-input :placeholder="$t('home.newsletterEmailPlaceholder')" />
          <a-button>{{$t('home.newsletterSubscribe')}}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getHomeDesign} from '@/api/login'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRightOutlined, LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue';
import { formatPrice } from "@/utils/index.js";
import 'swiper/swiper-bundle.css'
import CVideo from '@/components/CVideo.vue'
import useSettingStore from '@/store/modules/setting'

import Category from "@/views/home/components/category.vue";
import Arrivals from "@/views/home/components/arrivals.vue";
import Sellers from "@/views/home/components/sellers.vue";
import Brands from "@/views/home/components/brands.vue";
import Psay from "@/views/home/components/psay.vue";
import News from "@/views/home/components/news.vue";




const router = useRouter()


// 货币单位
const currency = ref(useSettingStore().global.currencySymbol || '')
const modules = ref([Autoplay, Pagination, Navigation])
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
const bannerList = ref(null)
// 首页配置
function getHomeSetting() {
  getHomeDesign().then(r => {
    const {data} = r
    bannerList.value = data.banners
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


getHomeSetting()
</script>

<style lang="scss" scoped>
.p-home {
  padding: 0 10%;
  .main-con {
    margin: 30px auto 100px;
    min-width: 1100px;
    .comp-box{
      width: 100%;
      margin: 30px auto;

    }
  }

.newsletter-box {
    padding: 60px 20px;
    text-align: center;
    border-radius: 20px;

    .section-title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .section-description {
      font-size: 16px;
      color: #555;
      margin-bottom: 32px;
    }

    .subscription-form {
      display: flex;
      justify-content: center;
      gap: 16px;

      .ant-input {
        width: 300px;
        height: 50px;
        border-radius: 8px;
      }

      .ant-btn {
        height: 50px;
        background-color: #0d1a33;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        padding: 0 24px;
      }
    }
  }

.bigLogo{
    margin-top: 45px;
  }
  .c-video {
    margin-top: 100px;
  }
  .group-head {
    margin-bottom: 32px;
    background-color: #000;
    padding: 8px 10px 20px;
    border-radius: 15px;
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
        color: #D4398F !important;
        margin-bottom: 16px;
        border-bottom: none;
      }
    }
  }
}
.banner{
  display: flex;
  gap: 15px; /* 设置网格之间的间隔 */
  //height: 430px;
  min-width:1000px;
  .column2{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  img{
    border-radius: 20px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
    transform: scale(1); /* 初始大小 */
    transition: transform 0.3s;
  }
  img:hover {
    transform: scale(1.01); /* 放大10% */
  }
}
.view-detail-btn {
  background-color: #FFF;
  color: #000;
  border: none;
  border-radius: 20px;
  padding: 20px;
  margin: 15px auto 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  cursor: pointer;
}
</style>
