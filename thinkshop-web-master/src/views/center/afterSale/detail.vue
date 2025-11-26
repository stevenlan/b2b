<script setup>
import { Steps, Step, Timeline, TimelineItem } from 'ant-design-vue';
import { CameraOutlined } from '@ant-design/icons-vue';
const ASteps = Steps;
const AStep = Step;
const ATimeline = Timeline;
const ATimelineItem = TimelineItem;
import { useRoute } from 'vue-router';
import router from "@/router/index.js";
import useCountdown from "@/hooks/useCountdown.js";
import { formatDateTime, formatPrice } from "@/utils/index.js";
import {
  deleteAfterSale,
  getDeliveryCompany,
  getOrderDetails,
  sendLogisticsInfo,
  withdrawalApplication
} from "@/api/afterSale.js";
import {getOrderLogistics} from "@/api/order.js";
import Spin from "@/utils/spin.js";
const route = useRoute();
import {message} from "ant-design-vue";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
import useSettingStore from '@/store/modules/setting'


const serviceType = ref('a')
const edit = ref(false)
const orderId = ref(route.query.id) // 订单ID
/*1:提交申请
2:平台审核通过
3:货物已寄回
4:商家同意退款
5:退款成功*/
const stepsData = ref([
  {
    type: 1,
    title: t('afterSale.submitAnOrder'),
    description: '',
  },
  {
    type: 2,
    title: t('afterSale.platformApproval'),
    description: '',
  },
  {
    type: 3,
    title: t('afterSale.returnGoods'),
    description: '',
  },
  {
    type: 4,
    title: t('afterSale.merchantAgreesToRefund'),
    description: '',
  },
  {
    type: 5,
    title: t('afterSale.refundSuccessful'),
    description: '',
  },
  {
    type: 6,
    title: t('afterSale.auditFailure'),
    description: '',
  },
  {
    type: 7,
    title: t('afterSale.userCancellation'),
    description: '',
  },
  {
    type: 8,
    title: t('afterSale.autoCancellation'),
    description: '',
  },
]);


const rules = ref({
  deliverySn: [{
    required: true,
    message: t('afterSale.enterTheTrackingNumberTip'),
    trigger: 'change',
  }],
  shipperCode: [{
    required: true,
    message: t('afterSale.selectALogisticsCompanyTip'),
    trigger: 'change',
  }],
})

// 获取订单详情
const stepBarData = ref([])
const explainImgList = ref([]) // 原因图片列表
const logs = ref([])
const remainingTime = ref('');
const orderDetail = ref({
  logs: []
}) // 订单详情数据
async function getDetailInfo(load) {
  let spinIntance
  if (load) spinIntance = Spin.service({target: '#loading', alignItems: 'center'});
  getOrderDetails(orderId.value).then((res) => {
    orderDetail.value = res.data;
    formData.value.id = orderDetail.value.id
    explainImgList.value = orderDetail.value.explainImg ? orderDetail.value.explainImg.split(',') : [];
    stepBarData.value = processStepsData(stepsData.value, orderDetail.value.logs, orderDetail.value.state, orderDetail.value.serviceType);
    const { state } = res.data
    // 获取物流信息
    if (state === 2) {
      getLogisticsInformation()
    }
    spinIntance?.close()
  }).catch(() => {
    spinIntance?.close()
  })
}
// 获取订单物流信息
const logisticsInfo = ref({})
function getLogisticsInformation() {
  getOrderLogistics(orderDetail.value.deliverySn).then((res) => {
    logisticsInfo.value = res.data;
  }).catch(() => {
  })
}

// 修改申请
function amendmentApplication() {
  edit.value = true
}
// 取消申请弹窗
const openValue = ref(false)
const cancelLoading = ref(false) // 取消申请按钮
function closeApplication() {
  openValue.value = false
}
function showCancelApplication() {
  openValue.value = true
}
function clickCancelApplication(id) {
  cancelLoading.value = true
  withdrawalApplication(id).then(() => {
    message.success(t('afterSale.cancelSuccessfully'))
    router.push({path:'/afterSale'})
  }).catch(() => message.error(t('afterSale.cancellationFailure')))
}

// 删除记录弹窗申请弹窗
const openDel = ref(false)
const delLoading = ref(false)
function closeDel() {
  openDel.value = false
}
function showCancelDel() {
  openDel.value = true
}
function clickDelAfterSale(id) {
  delLoading.value = true
  deleteAfterSale(id).then(() => {
    message.success(t('afterSale.successfullyDeleted'))
    router.push({path:'/afterSale'})
  }).catch(() => message.error(t('afterSale.deletionFailure')))
}

// 填写物流弹窗
const openMaterialFlow = ref(false)

const formData = ref({}) // 物流参数

function closeMaterialFlow() {
  openMaterialFlow.value = false
}
function showMaterialFlow() {
  openMaterialFlow.value = true
}
// 确认发货
const formRef = ref()
const materialLoading = ref(false)
function fillInLogisticsInfo() {
  formRef.value.validate().then(() => {
    materialLoading.value = true
    sendLogisticsInfo(formData.value).then(() => {
      message.success(t('afterSale.deliverySuccess'))
      openMaterialFlow.value = false
      getDetailInfo(true)
    }).catch(() => message.error(t('afterSale.deliveryFailure')))
  }).catch(error => {
    materialLoading.value = false
    console.log('error', error);
  });
}

// 获取物流公司列表
const deliveryList = ref([]) // 物流公司列表
function getDeliveryList() {
  getDeliveryCompany().then((res) => {
    deliveryList.value = res.data
  })
}

// 选择物流公司
function changeDelivery(data) {
  let matchedDelivery = deliveryList.value.find(item => item.value === formData.value.shipperCode);
  if(matchedDelivery) {
    formData.value.deliveryName = matchedDelivery.label;
  }
}
// 处理不同状态下的步骤
function processStepsData(stepsData, logs, state, serviceType) {
  let stepsDataCopy = JSON.parse(JSON.stringify(stepsData));
  if (state === -1 || state === -2) {
    stepsDataCopy = stepsDataCopy.filter(step => logs.some(log => log.operateType === step.type));
  } else if (state !== -1 && state !== -2 && serviceType === 0 && [0, 3, 4].includes(state)) {
    stepsDataCopy = stepsDataCopy.filter(step => [1, 4, 5].includes(step.type));
  } else if (state !== -1 && state !== -2 && serviceType === 1 && [0, 1, 2, 3, 4].includes(state)) {
    stepsDataCopy = stepsDataCopy.filter(step => [1, 2, 3, 4, 5].includes(step.type));
  }
  stepsDataCopy.forEach((step) => {
    const log = logs.find(log => log.operateType === step.type);
    // 将createTime 字段赋值给步骤项的 description 字段
    if (log) {
      step.description = log.createTime;
    }
  });
  return stepsDataCopy;
}

onMounted(() => {
  getDetailInfo(true)
  getDeliveryList()
})
</script>

<template>
  <div class="p-center">
    <div class="main-con" id="loading">
      <div class="order-detail">
        <div class="top-state">
          <div class="top-l">
            <div class="order-state">
              <span v-if="orderDetail.state === 0">{{t('afterSale.waitingForPlatformReview')}}</span>
              <span v-if="orderDetail.state === 1">{{t('afterSale.returnGoodsAsSoonAsPossible')}}</span>
              <span v-if="orderDetail.state === 2">{{t('afterSale.merchantReceivingGoods')}}</span>
              <span v-if="orderDetail.state === 3">{{t('afterSale.refundSuccessful')}}</span>
            </div>
            <div class="order-id">{{t('afterSale.orderNumber')}}：{{orderDetail.orderCode}}</div>
          </div>
          <div class="top-r ant-btn">
            <a-button @click="showCancelDel" v-if="orderDetail.state === 3 || orderDetail.state === -2 || orderDetail.state === -1" a-button class="del-btn line-btn">{{t('afterSale.deleteRecord')}}</a-button>
            <!--            <a-button class="del-btn line-btn" @click="amendmentApplication">修改申请</a-button>-->
            <a-button class="del-btn s-btn" v-if="orderDetail.state === 0 || orderDetail.state === 1 || orderDetail.state === 2" @click="showCancelApplication">{{t('afterSale.withdrawalOfApplication')}}</a-button>
          </div>
        </div>
        <div class="order-detail-box">
          <a-steps labelPlacement="vertical" :current="orderDetail.logs.length" :items="stepBarData" />
          <div class="receipt-info" v-if="orderDetail.state === 1">
            <h4>{{t('afterSale.returnAddress')}}</h4>
            <div class="receipt-box">
              <div class="receipt-userName">{{orderDetail.consignee}}</div>
              <div class="receipt-address">
                <div class="receipt-address-detail">{{orderDetail.address}}</div>
                <div class="receipt-address-contact">{{orderDetail.phoneNumber}}，{{t('orderDetail.postcode')}}：{{orderDetail.postCode}}</div>
              </div>
              <div class="receipt-country">{{orderDetail.country}}</div>
            </div>
          </div>
          <div class="logistics" v-if="orderDetail.state === 1 || orderDetail.state === 2 || orderDetail.state === 3">
            <h4>{{t('afterSale.returnLogisticsInfo')}}</h4>
            <div class="logistics-box" v-if="orderDetail.state !== 1">
              <div class="logistics-tit">
                <div class="logistics-companiess">{{t('afterSale.logisticsCompany')}}：<b>{{orderDetail.deliveryName}}</b></div>
                <div class="tracking-number">{{t('afterSale.waybillNumber')}}：<b>{{orderDetail.deliverySn}}</b></div>
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
            <div v-else class="ant-btn materialFlow-btn">
              <a-button class="add-btn"  @click="showMaterialFlow">
                {{t('afterSale.fillInLogisticsInfo')}}
              </a-button>
            </div>
          </div>
          <div class="listing">
            <div class="listing-top">
              <div class="listing-left">
                <div class="listing-tit">{{t('afterSale.commodityList')}}</div>
                <div class="listing-num">{{t('afterSale.quantity')}}</div>
              </div>
              <div class="listing-total">{{t('afterSale.subtotal')}}</div>
            </div>
            <div class="list-product">
              <div class="product-item" v-for="(item, index) of orderDetail.details">
                <div class="product-left">
                  <a-checkbox v-if="edit" v-model:checked="checked"></a-checkbox>
                  <div class="product-img">
                    <img :src="item.image" alt="">
                    <div class="product-info">
                      <div class="product-tit-sku">
                        <div class="product-tit">{{item.productName}}</div>
                        <div class="product-sku">{{item.sku}}</div>
                      </div>
                      <div class="product-amount">$ {{item.price}}</div>
                    </div>
                  </div>
                  <div class="product-num">{{item.num}}</div>
                </div>
                <div class="product-total">$ {{item.price * item.num}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="afterSales-Info">
          <h4>{{t('afterSale.afterSalesInfo')}}</h4>
          <div class="info-box">
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.totalRefund')}}：</div>
              <div class="info-value">${{orderDetail.refundAmount}}</div>
            </div>
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.totalMerchandise')}}：</div>
              <div class="info-value">${{orderDetail.totalPrice}}</div>
            </div>
            <div class="info-item">
              <div class="info-tit">{{t('commodity.toOffset')}}：</div>
              <div class="info-value">${{orderDetail.integralDeduct}}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.freight')}}：</div>
              <div class="info-value">${{orderDetail.totalPostage ? orderDetail.totalPostage : 0}}</div>
            </div>
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.commission')}}：</div>
              <div class="info-value">${{orderDetail.taxation}}</div>
            </div>
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.favorable')}}：</div>
              <div class="info-value">${{orderDetail.couponPrice}}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.serviceType')}}：</div>
              <div class="info-value">{{orderDetail.serviceType === 1 ? t('afterSale.returnGoodsRefund') : t('afterSale.refundOnly')}}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item explain">
              <div class="info-tit">{{t('afterSale.cause')}}：</div>
              <div class="info-value">{{orderDetail.reasons}}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item explain">
              <div class="info-tit">{{t('afterSale.applicationInstructions')}}：</div>
              <div class="info-value">{{orderDetail.explains}}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item">
              <div class="info-tit">{{t('afterSale.photoCertificate')}}：</div>
              <div class="info-value">
                <img v-for="(item, index) of explainImgList" :src="item" :key="index">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="delete-modal">
      <a-modal
          v-model:open="openValue"
          title=""
          @ok="closeApplication"
          :centered="true"
          :footer="null"
      >
        <div class="delete-box">
          <h3>{{t('afterSale.whetherToDelete')}}</h3>
          <div class="delete-order">
            <div class="btn-box">
              <a-button class="add-btn s-btn" @click="closeApplication">{{t('afterSale.cancel')}}</a-button>
              <a-button :loading="cancelLoading" class="s-btn" @click="clickCancelApplication(orderDetail.id)">{{t('afterSale.affirm')}}</a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
    <div class="delete-modal">
      <a-modal
          v-model:open="openDel"
          title=""
          @ok="closeDel"
          :centered="true"
          :footer="null"
      >
        <div class="delete-box">
          <h3>{{t('order.whetherToDelete')}}</h3>
          <div class="delete-order">
            <div class="btn-box">
              <a-button class="add-btn s-btn" @click="closeDel">{{t('afterSale.cancel')}}</a-button>
              <a-button :loading="delLoading" class="s-btn" @click="clickDelAfterSale(orderDetail.id)">{{t('afterSale.deleteAnOrder')}}</a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
    <div class="materialFlow-modal">
      <a-modal
          v-model:open="openMaterialFlow"
          title=""
          @ok="closeMaterialFlow"
          :centered="true"
          :footer="null"
      >
        <div class="delete-box">
          <h3>{{t('afterSale.inputLogistics')}}</h3>
          <a-form
              :model="formData"
              :rules="rules"
              ref="formRef"
          >
            <a-form-item name="deliverySn">
              <c-input v-model:value="formData.deliverySn" :placeholder="`${t('afterSale.logisticsTrackingNumber')}*`" class="e-input" />
            </a-form-item>
            <a-form-item name="shipperCode">
              <a-select
                  ref="select"
                  :placeholder="`${t('afterSale.logisticsCompany')}*`"
                  v-model:value="formData.shipperCode"
                  @change="changeDelivery"
              >
                <a-select-option v-for="item of deliveryList" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <div class="delete-order">
            <div class="btn-box">
              <a-button class="add-btn s-btn" @click="closeMaterialFlow">{{t('afterSale.cancel')}}</a-button>
              <a-button :loading="materialLoading" class="s-btn" @click="fillInLogisticsInfo(orderDetail.id)">{{t('afterSale.affirm')}}</a-button>
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
      width: 1000px;
      margin: 45px auto;
      position: relative;
      .order-detail {
        .top-state {
          margin-bottom: 50px;
          display: flex;
          justify-content: space-between;
          .top-l {
            .order-state {
              font-weight: 600;
              font-size: 16px;
              color: #262626;
              margin-bottom: 4px;
            }
            .order-id {
              font-size: 12px;
              color: #8C8C8C;
              font-weight: 400;
            }
          }
          .top-r {
            display: flex;
            .del-btn {
              margin-left: 10px;
            }
          }
          .del-btn {
            padding: 0 10px;
            height: 44px;
            border-radius: 2px 2px 2px 2px;
          }
        }
        .listing {
          margin-top: 50px;
          margin-bottom: 30px;
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
              display: flex;
              .listing-tit {
                width: 580px;
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
              :deep(.product-left) {
                display: flex;
                .ant-checkbox-wrapper {
                  height: min-content;
                  .ant-checkbox-checked {
                    .ant-checkbox-inner {
                      background-color: #262626;;
                      border-color: #262626;
                    }
                  }
                  .ant-checkbox-checked:hover {
                    .ant-checkbox:after {
                      border-color: #262626;
                    }
                  }
                  .ant-checkbox-checked:after {
                    border-color: #262626 !important;
                  }
                }
                .product-img {
                  width: 580px;
                  display: flex;
                  margin-left: 12px;
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
                  }
                  .product-amount {
                    color: #666666;
                  }
                }
              }
            }
          }
        }
        .materialFlow-btn {
          display: flex;
          justify-content: center;
          button {
            height: 44px;
            margin: 0 auto;
            padding: 0 10px;
          }
        }
        .logistics {
          margin-top: 30px;
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
          margin: 50px 0 32px 0;
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
        .price-breakdown {
          background: #FAFAFA;
          border-radius: 2px;
          padding: 16px;
          font-weight: 400;
          font-size: 14px;
          color: #262626;
          .flex-box {
            margin-bottom: 8px;
          }
          .amount-due {
            padding-top: 24px;
            margin-top: 16px;
            border-top: #E5E5E5 solid 1px;
          }
        }
        .form-box {
          margin-top: 32px;
          .type-service {
            .type-item {
              width: 117px;
              height: 44px;
              line-height: 44px;
              text-align: center;
              border-radius: 2px;
              border: 1px solid #8C8C8C;
              font-weight: 400;
              font-size: 14px;
              color: #8C8C8C;
              cursor: pointer;
              margin-right: 16px;
            }
            .type-item:hover, .active {
              border: 1px solid #262626;
              color: #262626;
            }
          }
          .clearfix {
            margin-bottom: 32px;
            .number-uploads {
              font-weight: 400;
              font-size: 12px;
              color: #262626;
              b {
                font-weight: 400;
                color: #E85A2B;
              }
            }
          }
        }
        .submit-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FAFAFA;
          border-radius: 2px;
          padding: 16px;
          .ant-btn {
            display: flex;
            align-items: center;
            .btn-item {
              margin-left: 15px;
              button {
                height: 44px;
                justify-content: center;
                padding: 0 10px;
              }
            }
          }
        }
      }
    }
  }
  :deep(.order-detail-box) {
    .ant-steps {
      .ant-steps-item-container:hover {
        .ant-steps-item-icon {
          border-color: #262626 !important;
          .ant-steps-icon{
            color: #262626 !important;
          }
        }
        .ant-steps-item-title {
          font-weight: 500;
          color: #262626 !important;
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
        .ant-steps-icon {
          color: #929292;
          font-weight: 500;
        }
      }
      .ant-steps-item-finish {
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
          .ant-steps-item-description {
            color: #262626 !important;
          }
        }
      }
    }
  }
  .afterSales-Info {
    h4 {
      margin-bottom: 20px;
    }
    .info-box {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .info-item {
        display: flex;
        width: 400px;
        color: #262626;
        font-size: 14px;
        .info-tit {
          width: 162px;
          text-align: right;
        }
        .info-value {
          flex: 1;
          text-align: left;
          font-weight: 500;
          img {
            width: 80px;
            height: 80px;
            margin-right: 15px;
          }
        }
      }
      .explain {
        width: 1000px;
      }
    }
  }
  // 选择样式
  :deep(.checkbox) {
    .ant-checkbox-wrapper {
      height: min-content;
      .ant-checkbox-checked {
        .ant-checkbox-inner {
          background-color: #262626 !important;;
          border-color: #262626 !important;;
        }
      }
      .ant-checkbox-checked:hover {
        .ant-checkbox:after {
          border-color: #262626 !important;;
        }
      }
      .ant-checkbox-checked:after {
        border-color: #262626 !important;
      }
    }
  }
  .delete-box {
    h3 {
      text-align: center;
    }
    .delete-order {
      .btn-box {
        margin-top: 20px;
        display: flex;
        button {
          margin:5px;
        }
      }
    }
    .ant-btnant-btn {
      display: flex;
      align-items: center;
    }
  }
  :deep(.order-detail-box) {
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
