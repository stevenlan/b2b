<script setup>
import {CloseOutlined} from "@ant-design/icons-vue";
import router from "@/router/index.js";
import { toRefs } from 'vue'
import { formatDateTime, formatPrice } from "@/utils/index.js";
// import useCountdown from "@/hooks/useCountdown.js";
import {message} from "ant-design-vue";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
import useSettingStore from '@/store/modules/setting'
import {withdrawalApplication, deleteAfterSale} from "@/api/afterSale.js";
const currency = ref(useSettingStore().global.currencySymbol || '')

const props = defineProps({
  item: Object
})
const STATUS_TEXT = {
  '0': t('afterSale.submitted'),
  '1': t('afterSale.toBeReturned'),
  '2': t('afterSale.returned'),
  '3': t('afterSale.merchantAgreesToRefund'),
  '4': t('afterSale.refundSuccessful')
};
const { item } = toRefs(props)
const statusText = STATUS_TEXT[item.value.state] || '' // 订单状态

function goToOrderDetails(id) {
  router.push({path: '/afterSale-detail', query: {id: id}});
}

function delOrder(id) {
  deleteAfterSale(id).then(() => {
    message.success(t('afterSale.successfullyDeleted'))
    emit('rest')
  }).catch(() => message.error(t('afterSale.deletionFailure')))
}

// 取消售后
function clickCancelOrder(id) {
  withdrawalApplication(id).then(() => {
    message.success(t('afterSale.cancelSuccessfully'))
    emit('rest')
  }).catch(() => message.error(t('afterSale.cancellationFailure')))
}

const emit = defineEmits(['rest'])
</script>

<template>
  <div class="order-item">
    <div class="item-top">
      <div class="order-time">
        <div class="order-date">{{t('afterSale.orderDate')}}：{{item.createTime}}</div>
        <div class="order-id">{{t('afterSale.orderNumber')}}：{{item.orderCode}}</div>
      </div>
      <a-popconfirm
          :title="t('afterSale.whetherToDelete')"
          :ok-text="t('afterSale.affirm')"
          :cancel-text="t('afterSale.cancel')"
          @confirm="delOrder(item.id)"
      >
        <div class="order-del" v-if="item.status === 3 || item.state === 4">
          <CloseOutlined />
          <span>{{t('afterSale.remove')}}</span>
        </div>
      </a-popconfirm>
    </div>
    <div class="order-info">
      <div class="product-list">
        <div class="product-item" v-for="product of item.details" :key="item.id">
          <div class="product-img">
            <img :src="product.image" class="pic-img default-img">
            <div class="product-info">
              <div class="product-tit-sku">
                <div class="product-tit">{{product.productName}}</div>
                <div class="product-sku">{{product.sku}}</div>
              </div>
              <div class="product-number">x{{product.num}}</div>
            </div>
          </div>
          <div class="product-info-right">
            <div class="product-amount">{{currency}}{{formatPrice(product.price)}}</div>
            <div class="product-status">
              <div class="product-status-text">
                {{statusText}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-detail">
        <div class="order-amount">
        </div>
        <div class="order-btn">
          <a-popconfirm
              :title="t('afterSale.whetherToCancelOrder')"
              :ok-text="t('afterSale.affirm')"
              :cancel-text="t('afterSale.cancel')"
              @confirm="clickCancelOrder(item.id)"
          >
            <div v-if="item.state === 0">{{t('afterSale.withdrawalOfApplication')}}</div>
          </a-popconfirm>
          <div @click="goToOrderDetails(item.id)">{{t('afterSale.afterSaleDetails')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-item {
  margin-bottom: 25px;
  .item-top {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #262626;
    color: #ffffff;
    padding: 0 16px;
    font-size: 14px;
    .order-time {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .order-date {
        width: 520px;
      }
      .order-id {
        flex: 1;
      }
    }
    .order-del {
      width: 275px;
      text-align: right;
      cursor: pointer;
      font-size: 12px;
      span {
        margin-left: 3px;
      }
    }
  }
  .order-info {
    border: #E5E5E5 solid 1px;
    display: flex;
    align-items: center;
    .product-list {
      flex: 1;
      border-right: #E5E5E5 1px solid;
      .product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #E5E5E5;
        .product-amount {
          font-weight: 600;
        }
        .product-status {
          color: #262626;
          font-weight: 400;
          padding-right: 80px;
          .product-status-text {
            text-align: right;
          }
          .product-btn {
            cursor: pointer;
            margin-top: 5px;
            font-weight: 600;
            text-align: right;
          }
        }
        .product-img {
          display: flex;
          width: 520px;
          img {
            width: 98px;
            height: 110px;
            margin-right: 12px;
          }
          .product-info {
            color: #262626;
            font-size: 14px;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            .product-tit {
              font-weight: 600;
              margin-bottom: 15px;
            }
            .product-sku {
              font-weight: 400;
            }
            .product-number {
              color: #666666;
            }
          }
        }
        .product-info-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }
      }
      .product-item:last-child {
        border-bottom: none;
      }
    }
    .order-detail {
      width: 275px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 16px;
      padding-left: 40px;
      font-weight: 600;
      color: #262626;
      .order-btn {
        cursor: pointer;
        text-align: right;
        text-decoration-line: underline;
        div {
          margin-bottom: 10px;
        }
      }
    }
  }
}
:deep(.repurchase-btn) {
  padding: 0;
  span {
    text-decoration: underline;
  }
}
</style>
