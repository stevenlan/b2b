<template>
  <div>
    <div class="news-review-box" v-if="list&&list.length>0">
      <h2 class="section-title">{{$t('home.newsAndReviewTitle')}}</h2>
      <a-flex :gap="30">
        <div class="review-card" v-for="(item, index) in list" :key="index" @click="toRouter(item)">
          <img :src="item.cover" :alt="item.title" class="review-image" />
          <h3 class="review-title">{{ item.title }}</h3>
          <p class="review-description">{{ item.mainPoint }}</p>
        </div>
      </a-flex>
      <a-button class="view-all-btn">
        {{$t('home.viewAll')}} <ArrowRightOutlined />
      </a-button>
    </div>
  </div>
</template>

<script setup>
import {newsList} from '@/api/home.js'
import { ArrowRightOutlined } from '@ant-design/icons-vue';
const router = useRouter()
// 组件跳转
function toRouter(item) {
  router.push(`/news-detail/${item.id}`)
}
const query = ref({
  pageNum:1,
  pageSize:3
})
const list = ref(null)
function getList(){
  newsList(query.value).then(res=>{
    list.value = res.rows
  })
}
getList()
</script>

<style lang="scss" scoped>
.news-review-box {
  margin-top: 65px;
  text-align: center;
  .section-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .review-card {
    width: calc(33.333% - 20px);
    text-align: left;
    .review-image {
      width: 430px;
      height: 430px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .review-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .review-description {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }
  }
  .view-all-btn {
    margin-top: 40px;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 25px;
    padding: 10px 24px;
    height: 50px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
}
</style>
