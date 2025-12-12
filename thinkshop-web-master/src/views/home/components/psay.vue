<template>
  <div>
    <div class="testimonials-box" v-if="list&&list.length>0">
      <h2 class="section-title">{{$t('home.whatPeopleSayTitle')}}</h2>
      <div class="swiper-container-with-nav">
        <swiper
            :slides-per-view="1"
            :space-between="30"
            :navigation="{ prevEl: '.testimonial-swiper-button-prev', nextEl: '.testimonial-swiper-button-next' }"
            :modules="modules"
            class="testimonial-swiper"
        >
          <swiper-slide v-for="(item, index) in list" :key="index">
            <div class="testimonial-card" @click="toRouter(item)">
              <a-rate :value="item.score" disabled />
              <p class="testimonial-text">{{ item.comment }}</p>
              <div class="user-info">
                <div class="user-avatar">
<!--                  <img :src="item.imageUrlSet[0]" :alt="item.commentUser" />-->
                </div>
                <p class="user-name">{{ item.commentUser }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="testimonial-swiper-button-prev"><LeftOutlined /></div>
        <div class="testimonial-swiper-button-next"><RightOutlined /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {psaysList} from '@/api/home.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/swiper-bundle.css'

// 组件跳转
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
const emit = defineEmits('taps')
function toRouter(item) {
  emit('taps',item)
}

// 货币单位
const modules = ref([Autoplay, Pagination, Navigation])

const list = ref(null)
const query = ref({
  pageNum:1,
  pageSize:5
})
function getList(){
  psaysList(query.value).then(res=>{
    list.value = res.rows
  })
}
getList()
</script>

<style lang="scss" scoped>
.testimonials-box {
  margin-top: 65px;
  text-align: center;
  .section-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .swiper-container-with-nav {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  .testimonial-card {
    padding: 0 60px;
    .ant-rate {
      color: #e91e63;
      font-size: 24px;
      margin-bottom: 24px;
    }
    .testimonial-text {
      font-size: 18px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .user-avatar {
      width: 80px;
      height: 80px;
      background-color: #e7e7e7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 50px;
        max-height: 50px;
      }
    }
    .user-name {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .testimonial-swiper-button-prev,
  .testimonial-swiper-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
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
  .testimonial-swiper-button-prev {
    left: 0;
  }
  .testimonial-swiper-button-next {
    right: 0;
  }
}
</style>
