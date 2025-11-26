<script setup>
import router from "@/router/index.js";
import { useRoute } from 'vue-router'
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
const route = useRoute()
const menuList = shallowRef([
  {
    title: t('userCenter.userCenter'),
    key: '/center',
    subMenu: [
      {
        title: t('userCenter.accountManagement'),
        key: '/account'
      },
      {
        title: t('userCenter.notice'),
        key: '/notice'
      },
      {
        title: t('userCenter.addressManagement'),
        key: '/address'
      },
      {
        title: t('userCenter.discountCoupon'),
        key: '/coupon'
      },
      {
        title: t('userCenter.integral'),
        key: '/integral'
      }
    ]
  },
  {
    title: t('userCenter.transactionManagement'),
    key: '/deal',
    subMenu: [
      {
        title: t('userCenter.myOrder'),
        key: '/order'
      },
      {
        title: t('userCenter.afterSalesRecord'),
        key: '/afterSale'
      }
    ]
  }
])
const currentMenu = shallowRef({key: route.path})
function seleckMenu(item) {
  router.push({path: item.key})
  currentMenu.value = item
}
</script>
<template>
  <div class="p-center">
    <div class="main-con w-width">
      <a-flex :gap='25'>
        <div class="menu">
          <ul v-for="menu in menuList" :key="menu.key">
            <li>{{menu.title}}</li>
            <li
                v-for="item in menu.subMenu"
                :key="item.key"
                :class="{active: currentMenu.key===item.key}"
                @click="seleckMenu(item)"
            >
              {{item.title}}
            </li>
          </ul>
        </div>
        <div class="comp-con">
          <router-view />
        </div>
      </a-flex>
    </div>
  </div>
</template>
<style lang='scss' scoped>
.p-center {
  .main-con {
    margin:32px auto;
    .menu {
      width: 180px;
      ul {
        li {
          font-size: 14px;
          color: #8C8C8C;
          margin-top: 16px;
          cursor: pointer;
          &:nth-child(n+2) {
            text-indent: 16px;
          }
          &:first-child {
            color: #262626;
            font-weight: 600;
            margin-top: 0;
          }
          &.active {
            color: #262626;
          }
        }
        &:first-child {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px #E5E5E5 solid;
        }
      }
    }
    .comp-con {
      flex: 1;
    }
  }
}
</style>
