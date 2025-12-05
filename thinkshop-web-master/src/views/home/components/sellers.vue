<template>
  <div>
    <div class="best-sellers-box">
      <div class="group-head" style="display: flex;justify-content: space-between;margin-bottom: 32px">
        <p>{{$t('home.bestSellersTitle')}}</p>
        <a-tabs v-if="bestSellerTabs&&bestSellerTabs.length > 0" v-model:activeKey="tabSelect" class="best-seller-tabs" @tabClick="changeTabs">
          <a-tab-pane v-for="tab in bestSellerTabs" :key="tab.categoryId" :tab="tab.name"/>
        </a-tabs>
      </div>
      <a-flex :gap="40" wrap="wrap" style="padding: 0 90px">
        <div class="bs-product-card" v-for="(item, index) in list" :key="index" @click="toRouter(item)">
          <div class="bs-product-image-container">
            <img :src="item.image" :alt="item.productName" />
          <div class="new-badge">{{$t('home.new')}}</div>
          </div>
          <p class="bs-product-name">{{ item.productName }}</p>
          <p class="bs-product-price">{{ item.minPrice }}</p>
          <a-button class="bs-view-detail-btn">
            {{$t('layout.viewDetail')}}
            <ShoppingCartOutlined />
          </a-button>
        </div>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import {sellersList} from '@/api/home.js'
import { ShoppingCartOutlined } from '@ant-design/icons-vue';
import {categoryList} from "@/api/product.js";
const {proxy} = getCurrentInstance()

// 组件跳转
const emit = defineEmits('taps')
function toRouter(item) {
  emit('taps',item)
}

const bestSellerTabs = ref(null);
const tabSelect = ref(-1);

function queryCategory() {
  categoryList().then(res => {
    const {rows} = res
    bestSellerTabs.value = [
      {
        name: proxy.$t('layout.all'),
        categoryId: -1
      },
      ...rows
    ]
  })
}
queryCategory()

const list = ref(null)
/*1是新品的排序 0是推荐的排序 3是销量降序*/
const query = ref({
  categoryId: null,
  sort:3,
  pageNum:1,
  pageSize:8
})
function getList(){
  sellersList(query.value).then(res=>{
    list.value = res.rows
  })
}
function changeTabs(tab) {
  query.value.categoryId = tab == -1?null:tab
  getList()
}
getList()
</script>

<style lang="scss" scoped>
.best-sellers-box {
  margin-top: 65px;
  .group-head {
    p:first-child {
      font-size: 36px;
      font-weight: bold;
    }
    .best-seller-tabs {
      :deep(.ant-tabs-nav) {
        margin-bottom: 0;
        &::before {
          border-bottom: none;
        }
      }
      :deep(.ant-tabs-tab) {
        font-size: 18px;
        margin-left: 20px;
        color: #000;
      }
      :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
        color: #D4398F;
      }
      :deep(.ant-tabs-ink-bar) {
        background: #D4398F;
      }
    }
  }
  .bs-product-card {
    width: calc(25% - 30px);
    margin-bottom: 24px;
    text-align: center;

    .bs-product-image-container {
      position: relative;
      border-radius: 8px;
      margin-bottom: 16px;
      text-align: center;
      max-height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      .new-badge {
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

    .bs-product-name {
      font-size: 18px;
      font-weight: 600;
    }

    .bs-product-price {
      font-size: 18px;
      color: #939599;
      margin: 8px 0 16px;
    }

    .bs-view-detail-btn {
      background-color: #000;
      color: #fff;
      border: none;
      border-radius: 25px;
      padding: 10px 24px;
      height: 50px;
      width: 80%;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
    }
  }
}
</style>
