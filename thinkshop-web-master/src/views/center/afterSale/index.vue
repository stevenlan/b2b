<script setup>
import OrderItem from './components/OrderItem.vue'
import noDataImg from '@/assets/images/empty/noOrder.png';
import Spin from "@/utils/spin.js";
import {getOrderList} from "@/api/afterSale.js";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();

const keyWord = ref('')
const query = ref({
  pageSize: 5,
  pageNum: 1,
  state: 1,
  key: ''
})
const tabIndex = ref(0)
const tabList = ref([
  {
    name: t('afterSale.fullOrder'),
    value: 1
  },
  {
    name: t('afterSale.afterSaleProcessing'),
    value: 2
  },
  {
    name: t('afterSale.completed'),
    value: 3
  }
])
// 切换tab
function changeTab(item, index) {
  query.value.state = item.value;
  tabIndex.value = index;
  getOrderListFn()
}
// 获取订单列表数据
const orderList = ref([])
const allNumber = ref(0)
function getOrderListFn() {
  const spinIntance = Spin.service({target: '#loading'});
  getOrderList(query.value).then(res => {
    const {rows, total} = res
    allNumber.value = total
    orderList.value = rows;
    spinIntance.close()
  })
}
function search() {
  query.value.pageNum = 1
  getOrderListFn()
}
function restGetList() {
  query.value.pageNum = 1
  orderList.value = []
  getOrderListFn()
}

onMounted(() => {
  getOrderListFn()
})
const onShowSizeChange = (pageNum, pageSize) => {
  getOrderListFn()
};
</script>
<template>
  <div class="order">
    <div class="title-warp">
      <h3>{{t('afterSale.title')}}</h3>
      <a-flex class="order-search">
        <a-input style="border-color: #262626;width: 343px" :placeholder="t('afterSale.orderSearch')" @pressEnter="search" v-model:value="query.key">
          <template #prefix>
            <i class="iconfont icon-sousuo" />
          </template>
          <template #suffix>
            <span class="search-btn" @click="search">{{t('afterSale.search')}}</span>
          </template>
        </a-input>
      </a-flex>
    </div>
    <div class="order-top">
      <div class="order-tab">
        <div class="tab-item" v-for="(item, index) of tabList" :key="index" :class="{active: tabIndex === index}" @click="changeTab(item, index)">{{item.name}}</div>
      </div>
    </div>
    <div class="list-box" id="loading">
      <div class="order-list" v-if="orderList.length > 0">
        <order-item v-for="item of orderList" :key="item.id" :item="item" @rest="restGetList"></order-item>
        <a-pagination
            v-model:current="query.pageNum"
            v-model:pageSize="query.pageSize"
            show-size-changer
            :total="allNumber"
            @change="onShowSizeChange"
            :defaultPageSize="5"
            @showSizeChange="onShowSizeChange"
            :pageSizeOptions="['5','10','20','30','40','50']"
        />
      </div>
      <div v-else class="empty">
        <a-empty
            :image="noDataImg"
            :description="t('afterSale.noOrder')"
            :image-style="{height: '100px'}">
        </a-empty>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.order {
  .title-warp{
    display: flex;
    justify-content: space-between;
    h3 {
      margin-bottom: 30px;
      font-size: 20px;
    }
    .order-search {
      height: 36px;
      border-radius: 2px;
      align-items: center;
      .search-btn {
        padding-left: 10px;
        border-left: #cccccc solid 1px;
        cursor: pointer;
      }
    }
    .icon-sousuo {
      color: #8C8C8C;
    }
  }

  .order-top {
    display: flex;
    justify-content: space-between;
    .order-tab {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      .tab-item {
        font-weight: 400;
        font-size: 16px;
        color: #262626;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
        font-weight: 500;
        margin-right: 30px;
      }
      .active {
        color: #262626;
        border-bottom: #262626 solid 2px;
      }
    }
  }
  .list-box {
    position: relative;
  }
}
</style>
