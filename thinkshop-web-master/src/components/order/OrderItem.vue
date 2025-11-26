<script setup>
import {CloseOutlined} from "@ant-design/icons-vue";
import router from "@/router/index.js";
import { toRefs } from 'vue'
import { formatDateTime, formatPrice } from "@/utils/index.js";
import useCountdown from "@/hooks/useCountdown.js";
import {message} from "ant-design-vue";
import {cancelOrder, deleteOrder, getReorder, confirmReceiptOfGoods} from "@/api/order.js";``
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
import useSettingStore from '@/store/modules/setting'
const currency = ref(useSettingStore().global.currencySymbol || '')

const props = defineProps({
  item: Object
})
const STATUS_TEXT = {
  '-2': t('order.refunded'),
  '-1': t('order.cancelled'),
  '0': t('order.due'),
  '1': t('order.goodsWaitingToBeSent'),
  '2': t('order.waitToBeReceived'),
  '3': t('order.completed')
};
const { item } = toRefs(props)
const statusText = STATUS_TEXT[item.value.status] || '' // 订单状态
const { remainingTime } = useCountdown(item.value.time); // 订单倒计时

function goToOrderDetails(id) {
  router.push({path: '/order-detail', query: {id: id}});
}
function goToOrderComment(id) {
  router.push({path: '/order-comment', query: {id: id, form: 'center'}});
}

function delOrder(id) {
  deleteOrder(id).then(() => {
    message.success(t('order.successfullyDeleted'))
    emit('rest')
  }).catch(() => message.error(t('order.deletionFailure')))
}

// 去付款
function goToPay(id) {
  router.push({path: '/order-detail', query: {id: id, pay: true}});
}

// 取消订单
function clickCancelOrder(id) {
  cancelOrder(id).then(() => {
    message.success(t('order.cancelSuccessfully'))
    emit('rest')
  }).catch(() => message.error(t('order.cancellationFailure')))
}

// 获取再次购买信息
const loadingBtn = ref(false)
async function getRePurchaseInfo() {
  loadingBtn.value = true
  try {
    let res = await getReorder(item.value.id);
    let cartIdsString = res.data.cartId.join(","); // 转换为字符串
    loadingBtn.value = false
    router.push({path:'/shopping', query: {
        cartIds: cartIdsString
      }})
  } catch (err) {}
}

// 确认收货
function confirmGoods(id) {
  loadingBtn.value = true
  confirmReceiptOfGoods(id).then(res => {
    message.success(t('order.confirmSuccess'))
    loadingBtn.value = false
    emit('rest')
  }).catch(() => {
    message.error(t('order.failedToConfirm'))
    loadingBtn.value = false
  })
}
// 申请售后
function applyForAfterSales() {
  router.push({path:'/applyAfterSales', query: {
      id: item.value.id
    }})
}
const emit = defineEmits(['rest'])
</script>

<template>
  <div class="order-item">
    <div class="item-top">
      <div class="order-time">
        <div class="order-date">{{t('order.orderDate')}}：{{item.createTime}}</div>
        <div class="order-id">{{t('order.orderNumber')}}：{{item.orderCode}}</div>
      </div>
      <a-popconfirm
          :title="t('order.whetherToDelete')"
          :ok-text="t('order.affirm')"
          :cancel-text="t('order.cancel')"
          @confirm="delOrder(item.id)"
      >
        <div class="order-del" v-if="item.status === 3 || item.status === -1">
          <CloseOutlined />
          <span>{{t('order.remove')}}</span>
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

              <div class="product-btn" v-if="item.status === 3 || item.status === -1" @click="getRePurchaseInfo">
                <a-button class="repurchase-btn" type="text" :loading="loadingBtn">{{t('order.repurchase')}}</a-button>
              </div>
              <a-popconfirm
                  :title="t('order.confirmReceiptOfGoods')"
                  :ok-text="t('order.affirm')"
                  :cancel-text="t('order.cancel')"
                  @confirm="confirmGoods(item.id)"
              >
                <div class="product-btn" v-if="item.status === 2">
                  <a-button class="repurchase-btn" type="text" :loading="loadingBtn">{{t('order.confirmGoods')}}</a-button>
                </div>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </div>
      <div class="order-detail">
        <div class="order-amount">
          <span>{{currency}}{{formatPrice(item.payPrice)}}</span>
        </div>
        <div class="order-btn">
          <div @click="goToOrderComment(item.id)" v-if="item.canComment">{{t('order.comment')}}</div>
          <div v-if="item.status === 0" @click="goToPay(item.id)">{{t('order.payment')}} {{remainingTime}}</div>
          <a-popconfirm
              :title="t('order.whetherToCancelOrder')"
              :ok-text="t('order.affirm')"
              :cancel-text="t('order.cancel')"
              @confirm="clickCancelOrder(item.id)"
          >
            <div v-if="item.status === 0">{{t('order.cancelAnOrder')}}</div>
          </a-popconfirm>
          <div v-if="item.canAfterSale" @click="applyForAfterSales">{{t('order.applySalesService')}}</div>
          <div @click="goToOrderDetails(item.id)">{{t('order.orderDetails')}}</div>
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
