<template>
  <div>
    <!-- 按类别浏览 -->
    <div class="category-swiper-box" v-if="list&&list.length>0">
      <div class="group-head" style="margin-bottom: 25px">
        <p>{{ $t('layout.typeToCheck') }}</p>
        <p><span @click="toRouter({ redirectUrl: '/#/product-list' })">{{ $t('layout.seeAllDeel') }}</span></p>
      </div>
      <div class="swiper-container-with-nav">
        <swiper
            :slides-per-view="4"
            :space-between="30"
            :navigation="{ prevEl: '.swiper-button-prev-custom', nextEl: '.swiper-button-next-custom' }"
            :modules="modules"
            class="category-swiper"

        >
          <swiper-slide v-for="item in list" :key="item.categoryId">
            <div class="category-card">
              <img :src="item.pictureUrl" alt="" class="category-image"/>
              <div class="category-info">
                <p class="category-name">{{ item.name }}</p>
                <a-button class="view-detail-btn" @click="toRouter({ redirectUrl: '/#/product-list?categoryId='+item.categoryId })">
                  {{ $t('layout.viewDetail') }} <ArrowRightOutlined />
                </a-button>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev-custom"><LeftOutlined /></div>
        <div class="swiper-button-next-custom"><RightOutlined /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {categoryList} from '@/api/home.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/swiper-bundle.css'
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';


// 组件跳转
const router = useRouter()
const emit = defineEmits('taps')
function toRouter(item) {
  emit('taps',item)
  //router.push(it.path)
}


// 货币单位
const modules = ref([Autoplay, Pagination, Navigation])

const list = ref(null)
function getCategoryList(){
  categoryList().then(res=>{
    list.value = res.rows
  })
}
getCategoryList()
</script>

<style lang="scss" scoped>
.category-swiper-box {
  margin-top: 65px;
  .group-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    p:first-child {
      font-size: 36px;
      font-weight: bold;
    }
    p:last-child span {
      font-size: 16px;
      color: #D4398F;
      cursor: pointer;
    }
  }

  .swiper-container-with-nav {
    position: relative;
    padding: 0 75px;
  }

  .category-swiper {
    :deep(.swiper-wrapper){
      padding-top: 50px !important;
    }
    .category-card {
      position: relative;
      border-radius: 20px;
      height: 290px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 50px 20px 20px;
      box-sizing: border-box;
      color: white;
      background: radial-gradient(#795ED9, #9075EB, #9C81F3, #A78CFC);

      .category-info{
        text-align: center;
      }
      .category-image {
        position: absolute;
        width: 160px;
        height: 200px;
        top: 0;
        left: 50%;
        transform: translate(-50%, -15%);
        object-fit: cover;
        z-index: 10;
        border-radius: 20px;
      }

      .category-name {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
      }

      .view-detail-btn {
        margin: 0 auto;
        background-color: #000;
        color: #fff;
        border: none;
        border-radius: 20px;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 150px;
        cursor: pointer;
      }
    }
  }

  .swiper-button-prev-custom,
  .swiper-button-next-custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    color: #000;
    font-size: 16px;
  }

  .swiper-button-prev-custom {
    left: 20px;
    border: 1px solid;
  }

  .swiper-button-next-custom {
    right: 20px;
    border: 1px solid;
  }
}
</style>
