<template>
  <div>
    <!-- 按类别浏览 -->
    <div class="new-arrivals-box" v-if="list&&list.length>0">
      <div class="group-head">
        <p>{{$t('home.newArrivalsTitle')}}</p>
        <p><span @click="toRouter({ redirectUrl: '/#/product-list' })">{{ $t('layout.seeAllDeel') }}</span></p>
      </div>
      <a-flex :gap="40" wrap="wrap" style="padding: 0px 90px;">
        <div class="product-card" v-for="(item, index) in list" :key="index" @click="toRouter(item)">
          <div class="product-image-container">
            <div>
              <img :src="item.image" :alt="item.productName" />
            </div>
            <div class="sale-badge">{{$t('home.sale')}} {{currency}}{{item.sales}}</div>
          </div>
          <p class="product-name">{{ item.productName }}</p>
          <p class="product-des">{{ item.introduce }}</p>
          <div class="price-box">
            <span class="current-price">{{currency}}{{ item.minPrice }}</span>
            <span class="old-price">{{currency}}{{ item.maxPrice }}</span>
          </div>
          <div class="color-swatches">
            <span v-for="(color, cIndex) in colorList" :key="cIndex" class="color-swatch" :class="[item.selectColor == color?'selected':'']" @click="item.selectColor = color">
              <div class="bgs" :style="{ backgroundColor: color }"></div>
            </span>
          </div>
        </div>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import {arrivalsList} from '@/api/home.js'
import 'swiper/css'
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css'
import useSettingStore from '@/store/modules/setting'
const currency = ref(useSettingStore().global.currencySymbol || '')

// 组件跳转
const emit = defineEmits('taps')
function toRouter(item) {
  emit('taps',item)
}

// 货币单位
const modules = ref([Autoplay, Pagination, Navigation])

const colorList = ref(['red','blue','#000'])

const list = ref(null)
/*1是新品的排序 0是推荐的排序 3是销量降序*/
const query = ref({
  sort:1,
  pageNum:1,
  pageSize:4
})
function getList(){
  arrivalsList(query.value).then(res=>{
    const {rows} = res
    rows.forEach(v=>{
      v.selectColor = colorList.value[0]
    })
    list.value = rows
  })
}
getList()
</script>

<style lang="scss" scoped>
.new-arrivals-box {
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
  .product-card {
    width: calc(25% - 30px); // 24px gap, so (24*3)/4 = 18px adjustment per item
    margin-bottom: 24px;
    text-align: center;


    .product-image-container {
      position: relative;
      border-radius: 8px;
      display: flex;
      display: flex;
      justify-content: center;
      img {
        width:200px;
        height:185px;
      }
      .sale-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: #D95ECC;
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 4px;
      }
    }

    .product-name {
      font-size: 18px;
      font-weight: 600;
    }

    .product-des {
      font-size: 12px;
      color: #939599;
      margin: 4px 0;
    }

    .price-box {
      margin: 15px 0;
      .current-price {
        font-size: 18px;
        color: #ff4d4f;
        font-weight: 600;
        margin-right: 8px;
      }
      .old-price {
        font-size: 18px;
        color: #939599;
        text-decoration: line-through;
      }
    }

    .color-swatches {
      display: flex;
      gap: 8px;
      justify-content: center;
      .color-swatch {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        .bgs{
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
      .selected{
        padding: 2px;
        border: 1px solid #000;
        background-color: #fff;
      }
    }
  }
}
</style>
