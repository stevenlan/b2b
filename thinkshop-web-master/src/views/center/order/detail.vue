<script setup>
import { Steps, Step, Timeline, TimelineItem } from 'ant-design-vue';
const ASteps = Steps;
const AStep = Step;
const ATimeline = Timeline;
const ATimelineItem = TimelineItem;
import { useRoute } from 'vue-router';
import router from "@/router/index.js";
import useCountdown from "@/hooks/useCountdown.js";
import { formatDateTime, formatPrice } from "@/utils/index.js";
import {getOrderDetails, getOrderLogistics, getReorder, confirmReceiptOfGoods, deleteOrder, orderConfig} from "@/api/order.js";
import Spin from "@/utils/spin.js";
const route = useRoute();
import {message} from "ant-design-vue";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
import useSettingStore from '@/store/modules/setting'
import Pay from '../../shopping/pay.vue'
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const orderId = ref(route.query.id) // 订单ID
const stepsData = ref([
  {
    type: 1,
    title: t('order.submitAnOrder'),
    description: '',
  },
  {
    type: 4,
    title: t('order.goodsWaitingToBeSent'),
    description: '',
  },
  {
    type: 5,
    title: t('order.waitToBeReceived'),
    description: '',
  },
  {
    type: 6,
    title: t('order.transactionCompleted'),
    description: '',
  },
]);

const logs = ref([])
// 获取订单详情
const remainingTime = ref('');
const orderDetail = ref({
  logs: []
}) // 订单详情数据
async function getDetailInfo(load) {
  let spinIntance
  if (load) spinIntance = Spin.service({target: '#loading', alignItems: 'center'});
  try {
    let res = await getOrderDetails(orderId.value);
    orderDetail.value = res.data;
    const { status } = res.data
    for (let i = 0; i < stepsData.value.length; i++) {
      let matchedData = orderDetail.value.logs.find(item => item.operateType === stepsData.value[i].type);
      if (matchedData) {
        stepsData.value[i].description = matchedData.createTime;
      }
    }
    if (status === 0) {
      remainingTime.value = useCountdown(orderDetail.value.time); // 订单倒计时
    } else {
      resumePayment.value = false
      clearTimer()
    }
    // 订单待收货状态获取物流信息
    if (orderDetail.value.status === 2) {
      getLogisticsInformation()
    }
  } catch (err) {
    spinIntance?.close()
  } finally {
    spinIntance?.close()
  }
}
// 获取订单物流信息
const logisticsInfo = ref({})
async function getLogisticsInformation() {
  try {
    let res = await getOrderLogistics(orderDetail.value.deliveryId);
    logisticsInfo.value = res.data;
  } catch (err) {}
}
// 获取再次购买信息
const loadingBtn = ref(false)
async function getRePurchaseInfo() {
  loadingBtn.value = true
  try {
    let res = await getReorder(orderId.value);
    console.log(res.data, 'res')
    let cartIdsString = res.data.cartId.join(","); // 转换为字符串
    loadingBtn.value = false
    router.push({path:'/shopping', query: {
        cartIds: cartIdsString
      }})
  } catch (err) {}
}

function confirmGoods() {
  loadingBtn.value = true
  confirmReceiptOfGoods(orderId.value).then(res => {
    message.success(t('order.confirmReceiptSuccess'))
    router.push({path:'/order'})
  }).catch(() => {
    message.error(t('order.failedToConfirmReceipt'))
  })
}

const delLoading = ref(false)
function clickDeleteOrder(id) {
  delLoading.value = true
  deleteOrder(id).then(() => {
    message.success(t('order.successfullyDeleted'))
    router.push({path:'/order'})
  }).catch(() => message.error(t('order.deletionFailure')))
}

function cancel() {
  openValue.value = false
}
function delOrder() {
  openValue.value = true
}
// 删除订单
const openValue = ref(false)

// 订单评价
function commentOrder() {
  router.push(`/order-comment?id=${orderDetail.value.id}`)
}

// 继续付款
const procedure = ref(1)
const tabList = computed(() => {
  const status = 0
  return [
    { label: ft('toRoder'), isFinish: true },
    { label: ft('pay'), isFinish: !!status },
    { label: ft('paySuceess'), isFinish: !!status }
  ]
})

const compRef = ref(null)
// 订单心跳
const orderTimer = ref(null)
const resumePayment = ref(route.query.pay)
if (resumePayment) {
  getOrderConfig()
}
function clickPay() {
  if (resumePayment.value) {
    compRef.value.toPay()
    if (!orderTimer.value) orderTimer.value = setInterval(() => { getDetailInfo(false) }, 5000)
  } else {
    resumePayment.value = true
    getOrderConfig()
  }
}
// 清除定时器、心跳
function clearTimer () {
  clearInterval(orderTimer.value)
  orderTimer.value = null
}

// 订单规则配置
const orderRule = ref({})
const query = ref({
  orderId: orderId.value
})
function getOrderConfig () {
  orderConfig().then(r => {
    orderRule.value = r.data
  })
}

function ft(field) {
  return proxy.$t(`commodity.${field}`)
}
onMounted(() => {
  getDetailInfo(true)
})
</script>

<template>
  <div class="p-center">
    <div class="main-con w-width">
      <div class="order-detail" id="loading">
        <div class="left-box">
          <div v-if="orderDetail.status === 0 && resumePayment">
            <div class="tab-box">
              <a-flex :gap="24">
                <div v-for="(it, i) in tabList"
                    :key="i"
                    :class="['tab-item', it.isFinish?'active':'']">
                  {{i+1}}.{{it.label}}
                </div>
              </a-flex>
            </div>
            <Pay ref="compRef" :order-rule="orderRule" :query="query"></Pay>
          </div>
          <div v-else>
            <a-steps labelPlacement="vertical" :current="orderDetail.logs.length" :items="stepsData" />
            <div class="listing">
              <div class="listing-top">
                <div class="listing-left">
                  <div class="listing-tit">{{t('order.commodityList')}}</div>
                  <div class="listing-num">{{t('order.quantity')}}</div>
                </div>
                <div class="listing-total">{{t('order.subtotal')}}</div>
              </div>
              <div class="list-product">
                <div class="product-item" v-for="item in orderDetail.details">
                  <div class="product-left">
                    <div class="product-img">
                      <img :src="item.image" class="pic-img default-img">
                      <div class="product-info">
                        <div class="product-tit-sku">
                          <div class="product-tit">{{item.productName}}</div>
                          <div class="product-sku">
                            <span class="sku-tit">{{t('order.sku')}}：</span>
                            <span class="sku-value">{{item.sku}}</span>
                          </div>
                        </div>
                        <div class="product-amount">{{currency}}{{formatPrice(item.originalPrice)}}</div>
                      </div>
                    </div>
                    <div class="product-num">{{item.num}}</div>
                  </div>
                  <div class="product-total">{{currency}}{{formatPrice(item.price)}}</div>
                </div>
              </div>
            </div>
            <div class="logistics" v-if="orderDetail.status === 2">
              <h4>{{t('order.logisticsInfo')}}</h4>
              <div class="logistics-box">
                <div class="logistics-tit">
                  <div class="logistics-companies">{{t('order.logisticsCompany')}}：<b>{{orderDetail.deliveryName}}</b></div>
                  <div class="tracking-number">{{t('order.waybillNumber')}}：<b>{{orderDetail.deliveryId}}</b></div>
                </div>
                <div class="timeline">
                  <a-timeline>
                    <a-timeline-item v-for="(item, index) in logisticsInfo" :key="index">
                      <template #dot><div class="circular" :class="{active: index === 0}"><i></i></div></template>
                      <p class="logistics_info">{{item.key_stage}}</p>
                      <p class="logistical-time">{{item.time_iso}}</p>
                    </a-timeline-item>
                  </a-timeline>
                </div>
              </div>
            </div>
            <div class="receipt-info">
              <h4>{{t('order.receivingInfo')}}</h4>
              <div class="receipt-box">
                <div class="receipt-userName">{{orderDetail.firstName}} {{orderDetail.lastName}}</div>
                <div class="receipt-address">
                  <div class="receipt-address-detail">{{orderDetail.addressDetail}}</div>
                  <div class="receipt-address-contact">{{orderDetail.userPhone}}，{{t('order.postcode')}}({{orderDetail.postCode}})</div>
                </div>
                <div class="receipt-country">{{orderDetail.country}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-box">
          <h4>{{t('order.orderSummary')}}</h4>
          <a-flex justify="space-between" align="center">
            <span>{{t('order.orderNumber')}}</span>
            <span>{{orderDetail.orderCode}}</span>
          </a-flex>
          <div class="order-amount">
            <a-flex justify="space-between" align="center" class="flex-box">
              <span class="label">{{t('order.grossCommodityPrice')}}</span>
              <span class="value">$ {{formatPrice(orderDetail.totalPrice)}}</span>
            </a-flex>
            <a-flex justify="space-between" align="center" class="flex-box">
              <span class="label">{{t('order.promotionalOffer')}}</span>
              <span class="value">-$ {{formatPrice(orderDetail.couponPrice)}}</span>
            </a-flex>
            <a-flex justify="space-between" align="center" class="flex-box">
              <span class="label">{{t('commodity.toOffset')}}</span>
              <span class="value">-$ {{formatPrice(orderDetail.integralDeduct)}}</span>
            </a-flex>
            <a-flex justify="space-between" align="center" class="flex-box">
              <span class="label">{{t('order.freight')}}</span>
              <span class="value">$ {{orderDetail.totalPostage}}</span>
            </a-flex>
            <a-flex justify="space-between" align="center" class="flex-box">
              <span class="label">{{t('order.commission')}}</span>
              <span class="value">$ {{orderDetail.taxation}}</span>
            </a-flex>
          </div>
          <div class="pocket-amount">
            <a-flex justify="space-between" align="center">
              <span class="label">{{t('order.actualAmountPaid')}}</span>
              <span class="value">$ {{formatPrice(orderDetail.payPrice)}}</span>
            </a-flex>
          </div>
          <div class="action-buttons">
            <div class="btn-item" @click="commentOrder(orderId.value)" v-if="orderDetail.canComment">{{t('order.comment')}}</div>
            <div class="btn-item" @click="delOrder(orderId.value)" v-if="orderDetail.status === -1 || orderDetail.status === 3">{{t('order.deleteAnOrder')}}</div>
<!--            <div class="btn-item" v-if="orderDetail.status === 1 || orderDetail.status === 2">{{t('order.applySalesService')}}</div>-->
            <div class="ant-popconfirm" v-if="orderDetail.status === -1 || orderDetail.status === 3" @click="getRePurchaseInfo">
              <a-button class="ant-btn-primary primary" :loading="loadingBtn">
                {{t('order.repurchase')}}
              </a-button>
            </div>
            <div class="primary btn-item" @click="clickPay" v-if="orderDetail.status === 0">{{resumePayment ? t('commodity.quiclPay') : t('order.immediatePayment')}} ({{remainingTime.remainingTime}})</div>
            <div class="ant-popconfirm" v-if="orderDetail.status === 2" @click="confirmGoods">
              <a-button class="ant-btn-primary primary" :loading="loadingBtn">
                {{t('order.confirmGoods')}}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="delete-modal">
      <a-modal
          v-model:open="openValue"
          title=""
          @ok="cancel"
          :centered="true"
          :footer="null"
      >
        <div class="delete-box">
          <h3>{{t('order.whetherToDelete')}}</h3>
          <div class="delete-order">
            <div class="btn-box">
              <a-button class="add-btn s-btn" @click="cancel">{{t('order.cancel')}}</a-button>
              <a-button :loading="delLoading" class="s-btn" @click="clickDeleteOrder(orderDetail.id)">{{t('order.deleteAnOrder')}}</a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .p-center {
    .main-con {
      margin: 45px auto;
      min-width: 1100px;
      .order-detail {
        display: flex;
        position: relative;
        .left-box {
          width: 74%;
          margin-right: 40px;
          .tab-box {
            margin-bottom: 24px;
            .tab-item {
              flex: 1;
              font-size: 16px;
              border-bottom: 2px #8c8c8c solid;
              color: #8c8c8c;
              padding-bottom: 8px;
              &.active {
                border-color: #262626;
                color: #262626;
              }
            }
          }
        }
        .right-box {
          flex: 1;
          background: #FAFAFA;
          border-radius: 2px;
          padding: 16px;
          box-sizing: border-box;
          h4 {
            margin-bottom: 20px;
          }
          .order-amount {
            border-top: #E5E5E5 solid 1px;
            border-bottom: #E5E5E5 solid 1px;
            padding: 24px 0;
            margin: 24px 0;
            span {
              font-size: 14px;
              color: #262626;
              font-weight: 400;
            }
            .flex-box {
              margin-bottom: 8px;
            }
          }
        }
        .action-buttons {
          .btn-item {
            height: 44px;
            line-height: 44px;
            width: 100%;
            border: #262626 solid 1px;
            border-radius: 2px;
            text-align: center;
            margin-top: 16px;
            font-size: 14px;
            cursor: pointer;
          }
          .primary {
            background: #262626;
            color: #FFFFFF;
          }
          .ant-popconfirm {
            margin-top: 16px;
            .ant-btn-primary {
              height: 44px;
              width: 100%;
            }
          }
        }
        .listing {
          margin-top: 50px;
          .listing-top {
            display: flex;
            font-weight: 600;
            font-size: 16px;
            color: #262626;
            border-bottom: 1px solid #E5E5E5;
            padding-bottom: 10px;
            margin-bottom: 15px;
            justify-content: space-between;
            .listing-left {
              width: 1000px;
              display: flex;
              .listing-tit {
                width: 680px;
              }
            }
            .listing-total {
              flex: 1;
              text-align: right;
            }
            .listing-tit {
              width: 500px;
            }
          }
          .list-product {
            .product-item {
              display: flex;
              width: 100%;
              justify-content: space-between;
              margin-bottom: 16px;
              padding-bottom: 16px;
              border-bottom: 1px solid #E5E5E5;
              .product-left {
                width: 1000px;
                display: flex;
                .product-img {
                  width: 680px;
                  display: flex;
                  img {
                    width: 98px;
                    height: 110px;
                    margin-right: 12px;
                  }
                }
                .product-num {
                  width: 260px;
                }
                .product-amount {
                  flex: 1;
                  display: flex;
                  flex-flow: column-reverse;
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
                    display: flex;
                    align-items: center;
                    .sku-tit {
                      font-size: 12px;
                      color: #666666;
                    }
                    .sku-value {
                      color: #262626;
                    }
                  }
                  .product-amount {
                    color: #666666;
                  }
                }
              }
            }
          }
        }
        .logistics {
          h4 {
            font-size: 16px;
          }
          .logistics-box {
            border-radius: 2px;
            border: 1px solid #8C8C8C;
            padding: 0 24px;
            .logistics-tit {
              border-bottom: 1px solid #E5E5E5;
              display: flex;
              align-items: center;
              height: 52px;
              margin-bottom: 25px;
              color: #8C8C8C;
              font-size: 14px;
              font-weight: 400;
              b {
                color: #262626;
                font-weight: 400;
              }
              .logistics-companies {
                margin-right: 24px;
              }
            }
            .timeline {
              .circular {
                border-radius: 50%;
                padding: 0;
                border: none;
                width: 10px;
                height: 10px;
                i {
                  width: 10px;
                  height: 10px;
                  display: block;
                  background: #BFBFBF;
                  border-radius: 50%;
                }
              }
              .active {
                width: 16px;
                height: 16px;
                padding: 2px;
                box-sizing: border-box;
                border: 1px solid #262626;
                i {
                  background: #262626;
                }
              }
              p {
                font-weight: 400;
                font-size: 14px;
                color: #262626;
              }
              .logistical-time {
                color: #8C8C8C;
              }
            }
          }
        }
        .receipt-info {
          margin-top: 50px;
          .receipt-box {
            display: flex;
            align-items: center;
            border-radius: 2px;
            border: 1px solid #8C8C8C;
            margin-top: 12px;
            padding: 16px 24px;
            font-size: 14px;
            .receipt-userName {
              width: 260px;
              font-weight: 600;
              color: #262626;
            }
            .receipt-address {
              width: 550px;
              color: #262626;
              font-weight: 400;
              .receipt-address-detail {
                margin-bottom: 5px;
              }
            }
            .receipt-country {
              flex: 1;
              color: #262626;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
  .delete-box {
    .delete-order {
      .btn-box {
        margin-top: 20px;
        display: flex;
        button {
          margin:5px;
        }
      }
    }
    .ant-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  :deep(.left-box) {
    .ant-steps {
      .ant-steps-item-container {
        cursor: initial !important;
      }
      .ant-steps-item-container:hover {
        .ant-steps-item-icon {
          .ant-steps-icon{
            color: #929292 !important;
          }
        }
        .ant-steps-item-title {
          font-weight: 500;
          color: #929292 !important;
        }
      }
      .ant-steps-item-title {
        font-weight: 500;
        color: #262626;
      }
      .ant-steps-item-title:after {
        background-color: #F5F5F5;
        height: 2px;
      }
      .ant-steps-item-icon {
        background-color: #F5F5F5;
        border-color: #F5F5F5;
        border: none !important;
        .ant-steps-icon {
          color: #929292;
          font-weight: 500;
        }
      }
      .ant-steps-item {
        cursor: none !important;
      }
      .ant-steps-item-finish {
        .ant-steps-item-description {
          color: #262626 !important;
        }
        .ant-steps-item-icon {
          background-color: #262626;
          border-color: #262626;
          .ant-steps-icon {
            color: #ffffff;
            font-weight: 500;
          }
        }
        .ant-steps-item-title:after {
          background-color: #262626;
        }
        .ant-steps-item-container:hover {
          .ant-steps-item-icon {
            .ant-steps-icon {
              color: #ffffff !important;
              font-weight: 500;
            }
          }
          .ant-steps-item-title {
            font-weight: 500;
            color: #262626 !important;
          }
        }
        .ant-steps-item-tail::after {
          background-color: #262626;
        }
      }
      .ant-steps-item-active {
        .ant-steps-item-title {
          color: #929292 !important;
        }
      }
    }
  }
</style>
