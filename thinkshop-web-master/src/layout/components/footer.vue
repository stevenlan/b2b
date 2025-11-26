<template>
  <div class="c-footer">
    <div class="main-con w-width">
      <ul class="m-cell">
        <li class="logo v-flex">
          <img class="img" :src="useSetting.design.pageBottomUrl || fLogo"/>
          <p>{{useSetting.design.copyright}}</p>
        </li>
        <li v-for="(item, index) in mList" :key="index">
          <ul class="sub-cell v-flex">
            <li>{{item.title}}</li>
            <li v-for="(it, i) in item.children" :key="i">{{it.label}}{{`${it.value?': '+it.value:''}` }}</li>
          </ul>
        </li>
        <li class="code-list">
          <img v-for="(it, i) in codeList" :key="i" :src="it"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import useSettingStore from '@/store/modules/setting'
import fLogo from '@/assets/images/common/white_logo.png'

const useSetting = useSettingStore()
const {proxy} = getCurrentInstance()

const codeList = computed(() => {
  const {pageBottomQrCodeUrl} = useSetting.design
  if(pageBottomQrCodeUrl) return pageBottomQrCodeUrl.split(',')
  return []
})
const mList = computed(() => {
  const {address, email, phone, other} = useSetting.design
  return [
    // {
    //   title: '法律信息',
    //   children: [
    //     {label: '法律条款', value: '', type: ''},
    //     {label: '隐私政策/Cookies', value: '', type: ''},
    //     {label: '法律申明', value: '', type: ''},
    //   ]
    // },
    // {
    //   title: '购物帮助',
    //   children: [
    //     {label: '付款', value: '', type: ''},
    //     {label: '配送', value: '', type: ''},
    //     {label: '换货及退货', value: '', type: ''},
    //   ]
    // },
    // {
    //   title: '客户服务',
    //   children: [
    //     {label: '关于订单', value: '', type: ''},
    //     {label: '产品维护', value: '', type: ''},
    //     {label: '产品维修', value: '', type: ''},
    //   ]
    // },
    {
      title: proxy.$t('layout.aboutUs'),
      children: [
        {label: proxy.$t('layout.tel'), value: phone, type: ''},
        {label: proxy.$t('layout.address'), value: address, type: ''},
        {label: proxy.$t('layout.email'), value: email, type: ''},
      ]
    }
  ]
})

ref()
</script>

<style lang="scss" scoped>
.c-footer {
  background: #262626;
  .main-con {
    padding: 48px 0;
    margin: 0 auto;
    background: #262626;
    ul, p {
      margin-bottom: 0px !important;
    }
    .m-cell {
      color: #FFFFFF;
      display: flex;
      .v-flex {
          height: 119px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      li {
        flex: 1;
        font-size: 14px;
        .sub-cell {
          height: 119px;
          li {
            line-height: initial;
            &:nth-child(n+2) {
              font-size: 12px;
            }
          }
        }

        &.logo {
          position: relative;
          width: 340px;
          .img {
            width: 77px;
            height: 22px;
          }
          p {
            color: #8C8C8C;
            font-size: 12px;
          }
          &::after {
            content: '';
            display: block;
            position: absolute;
            height: 119px;
            width: 1px;
            background: #444444;
            top: 0;
            right: 50px;
          }
        }
        &.code-list {
          flex: 2;
          text-align: right;
          img {
            width: 128px;
            height: 100%;
            object-fit: cover;
            &:nth-child(n+2) {
              margin-left: 50px;
            }
          }
        }
      }
    }
  }
}
</style>