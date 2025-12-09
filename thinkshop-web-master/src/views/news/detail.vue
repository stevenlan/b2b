<template>
  <div class="product-detail">
    <div class="w-width main-con">
      <div class="info-box">
        <p class="p-title">{{detail.title}}</p>
        <p class="p-time">{{formatDateTime(detail.createTime)}}</p>
      </div>
      <div class="comment-detail">
        <div v-html="decodeURIComponent(detail.content)"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {formatDateTime} from "@/utils/index.js";
import {newsDetail} from '@/api/home'
import useCommodityStore from '@/store/modules/commodity'
import useSettingStore from '@/store/modules/setting'

import 'swiper/css'

const router = useRouter()
const useStore = useCommodityStore()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const detail = ref([])

// 商品详情
function getDetail() {
  const {params={}} = router.currentRoute?.value
  newsDetail(params.newsId).then(res => {
    detail.value = res.data
  })
}

getDetail()
</script>

<style scoped lang="scss">
.main-con {
  margin: 0 auto;
  .mb20 {
    margin-bottom: 20px;
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .info-box {
    padding: 32px 0;
    border-bottom: 1px #E5E5E5 solid;
    .p-title {
      font-size: 24px;
      margin-bottom: 4px;
      text-align: center;
    }
    .p-time{
      font-size: 15px;
      margin-bottom: 4px;
      text-align: center;
    }
    .pro-flex {
      justify-content: center;
    }
    .swiper-cell {
      width: 74px;
      height: 400px;
      .swiper-page {
        height: 24px;
        line-height: 24px;
        text-align: center;
        .iconfont {
          font-size: 24px;
        }
      }
      .swiper {
        height: 352px;
      }
      .img-box {
        padding: 4px;
        box-sizing: border-box;
        &.active {
          border: 1px solid #000000;
        }
        .img {
          width: 66px;
          height: 82px;
        }
      }
    }
    .img-list {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      height: 400px;
      overflow: scroll;
      .img-box {
        padding: 4px;
        box-sizing: border-box;
        &.active {
          border: 1px solid #000000;
        }
        .img {
          width: 66px;
          height: 82px;
        }
      }
      &::-webkit-scrollbar {
        width: 0;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .img-cell {
      width: 354px;
      height: 400px;
      img {
        width: 354px;
        height: 100%;
        object-fit: cover;
      }
    }
    .info-cell {
      width: 500px;
      .p-title {
        font-size: 24px;
        margin-bottom: 4px;
      }
      .intro {
        font-size: 16px;
        color: #939599;
      }
      .price {
        font-size: 18px;
        font-weight: 600;
        margin: 16px 0;
      }
      .sku {
        .sku-name {
          color: #8C8C8C;
          font-size: 14px;
          margin-bottom: 8px;
          span {
            color: #262626;
          }
        }
        .sku-item {
          height: 32px;
          line-height: 32px;
          border: 1px solid #8C8C8C;
          border-radius: 2px;
          color: #8C8C8C;
          font-size: 12px;
          padding: 0 20px;
          &.active {
            background: #262626;
            border: none;
            color: #FFFFFF;
          }
        }
      }
      .buy-cell {
        // width: 400px;
        .c-box {
          margin-bottom: 24px;
          height: 35px;
          font-size: 12px;
          p {
            font-size: 14px;
            color: #939599;
            &:nth-of-type(2) {
              border-radius: 2px;
              border: 1px #262626 solid;
              padding: 8px;
              span {
                font-size: 12px;
                &:first-child, &:last-child {
                  font-size: 16px;
                  display: inline-block;
                  height: 16px;
                  width: 16px;
                  text-align: center;
                  line-height: 16px;
                  border-radius: 50%;
                  background: #F5F5F5;
                  color: #A9A9B2;
                  &:hover {
                    cursor: pointer;
                  }
                }
                &:last-child {
                  background: #262626;
                  color: #FFFFFF;
                }
                &:nth-child(2) {
                  padding: 0 30px;
                  color: #8C8C8C;
                }
              }
            }
          }
        }
      }
    }
  }
  .comment-detail {
    padding-top: 24px;
    .tab-item {
      font-weight: 600;
      font-size: 16px;
      padding-bottom: 9px;
      cursor: pointer;
      margin-bottom: 32px;
      &.active {
        border-bottom: 2px #262626 solid;
      }
    }
    .comment {
      .comment-item {
        font-size: 14px;
        padding-bottom: 32px;
        border-bottom: 1px  #E5E5E5 solid;
        &:last-child {
          border: none;
        }
        .score {
          .sku {
            margin-right: 30px;
          }
        }
        .time {
          margin-top: 4px;
          font-size: 12px;
          color: #8C8C8C;
        }
        .comment-text {
          font-size: 14px;
          margin: 24px 0 16px;
        }
      }
      .comment-empty {
        text-align: center;
        padding: 100px 0;
        img {
          width: 100px;
          height: 100px;
        }
        p {
          font-size: 14px;
          color: #8C8C8C;
        }
      }
    }
  }
  .recommend {
    margin: 80px 0;
    .r-title {
      font-size: 36px;
      color: #262626;
      margin-bottom: 32px;
      text-align: center;
    }
    .recommend-list {
      .swiper {
        width: calc(100% - 100px);
      }
      .swiper-item {
        img {
          width: 100%;
          height: 320px;
          margin-bottom: 8px;
          object-fit: contain;
        }
        p {
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          &:nth-of-type(1) {
            font-size: 18px;
            margin-bottom: 4px;
          }
          &.intro {
            font-weight: 400;
            color: #939599;
            margin-bottom: 4px;
          }
        }
      }
      .s-page {
        line-height: 320px;
        .iconfont {
          font-size: 20px;
        }
      }
    }
  }
}
.social-icons {
  display: flex;
  justify-content: left;
  gap: 24px;
  a {
    font-size: 24px;
    color: #fff;
    background-color: #D4398F;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
