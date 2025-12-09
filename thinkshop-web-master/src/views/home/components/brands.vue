<template>
  <div>
    <div class="featured-brands-box" v-if="list&&list.length>0">
      <h2 class="section-title">{{$t('home.featuredBrandsTitle')}}</h2>
      <div class="brands-container">
        <a-flex justify="space-around">
          <div class="brand-item" v-for="(item, index) in list" :key="index">
            <div class="brand-image-wrapper">
              <img :src="item.brandImage" :alt="item.name" style="width: 60px;height: 100px"/>
            </div>
            <p>{{ item.name }}</p>
          </div>
        </a-flex>
      </div>
    </div>
  </div>
</template>

<script setup>
import {brandsList} from '@/api/home.js'

// 组件跳转
const emit = defineEmits('taps')
function toRouter(item) {
  emit('taps',item)
}

const list = ref(null)
const query = ref({
  pageNum:1,
  pageSize:5
})
function getList(){
  brandsList(query.value).then(res=>{
    list.value = res.rows
  })
}
getList()

</script>

<style lang="scss" scoped>
.featured-brands-box {
  margin-top: 65px;
  text-align: center;
  .section-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .brands-container {
    background-color: #f8f8f8;
    padding: 60px 0;
    border-radius: 20px;
  }
  .brand-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    p {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .brand-image-wrapper {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    img {
      max-width: 100px;
      max-height: 100px;
    }
  }
}
</style>
