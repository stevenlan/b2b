<script setup>
import {CameraOutlined} from '@ant-design/icons-vue';

import {useRoute} from 'vue-router';
import router from "@/router/index.js";
import useCountdown from "@/hooks/useCountdown.js";
import {formatDateTime, formatPrice} from "@/utils/index.js";
import {getOrderDetails} from "@/api/order.js";
import {applyForAfterSales} from "@/api/afterSale.js";
import Spin from "@/utils/spin.js";
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.js'
const route = useRoute();
import {message} from "ant-design-vue";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const useUser = useUserStore()
const currency = ref(useSettingStore().global.currencySymbol || '')
const refundOnlyReason = ref((useSettingStore().global.refundOnlyReason || []).map(reason => ({label: reason, value: reason})) );
const returnGoodsRefund = ref((useSettingStore().global.returnGoodsRefund || []).map(reason => ({label: reason, value: reason})) );
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload"); // 上传的图片服务器地址
const orderId = ref(route.query.id) // 订单ID

const form = reactive({
  serviceType: 0,
  reasons: '',
});
form.reasons = refundOnlyReason.value[0]?.value

// 修改服务类型
function changeType(type) {
  form.serviceType = type;
  if (form.serviceType === 1) {
    reasonList.value = returnGoodsRefund.value
  } else {
    reasonList.value = refundOnlyReason.value
  }
  form.reasons = reasonList.value[0]?.value
}
// 退款原因
const reasonList = ref(refundOnlyReason.value)
// 申请成功页面
const skipDisplay = ref(false)
// 上传图片列表
const requestHeaders = {
  Authorization: 'Bearer ' + useUser.token
}
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const fileList = ref([])

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

// 获取订单详情
const logs = ref([])
const remainingTime = ref('');
const orderDetail = ref({
  logs: [],
  details: []
}) // 订单详情数据
async function getDetailInfo(load) {
  let spinIntance
  if (load) spinIntance = Spin.service({target: '#loading', alignItems: 'center'});
  getOrderDetails(orderId.value).then((res) => {
    orderDetail.value = res.data;
    const {status} = res.data
    for (let i = 0; i < stepsData.value.length; i++) {
      let matchedData = orderDetail.value.logs.find(item => item.operateType === stepsData.value[i].type);
      if (matchedData) {
        stepsData.value[i].description = formatDateTime(matchedData.createTime);
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
    spinIntance?.close()
  }).catch(() => {
    spinIntance?.close()
  })
}

function selectProduct() {
  checkedAll.value = !orderDetail.value.details.some(item => !item.checked)
}
// 全选
const checkedAll = ref(false)
function selectAll(e) {
  orderDetail.value.details.forEach(item => {
    item.checked = e.target.checked
  })
}

// 提交申请
const loadingBtn = ref(false)
function clickApplyForAfterSales() {
  const urls = fileList.value.map(file => file.response.data.url);
  const explainImg = urls.join(',');
  let selectedList;
  if (orderDetail.value.details.length > 1) {
    // 当有多条数据时，检查 item.checked 和 item.state
    selectedList = orderDetail.value.details
        .filter(item => item.checked && item.state === 1)
        .map(item => ({ skuId: item.skuId, number: item.num }));
  } else {
    // 只有一条数据时，只检查 item.state
    selectedList = orderDetail.value.details
        .filter(item => item.state === 1)
        .map(item => ({ skuId: item.skuId, number: item.num }));
  }
  if(!selectedList.length) {
    message.error(t('afterSale.returnedGoodsTips'))
    return
  }
  loadingBtn.value = true
  applyForAfterSales(
      {
        details: selectedList,
        explainImg: explainImg,
        explains: form.explains,
        orderId: orderDetail.value.id,
        reasons: form.reasons,
        serviceType: form.serviceType
      }
  ).then((res) => {
    message.success(t('afterSale.applicationIsSuccessful'))
    loadingBtn.value = false
    skipDisplay.value = true
  }).catch((err) => {
    message.error(t('afterSale.applicationFailure'))
    loadingBtn.value = false
  })
}

// 取消申请
function cancelApplication() {
  router.push({path:'/order'})
}

// 计算总退款金额
// 总价格
const totalPrice = computed(() => {
  let total = 0
  orderDetail.value.details.forEach(item => {
    if(item.checked) {
      total += item.num * item.price
    }
  })
  return total
})

// 返回首页
function goToHome() {
  router.push({path:'/index'})
}

// 返回订单页面
function goToOrder() {
  router.push({path:'/afterSale'})
}

onMounted(() => {
  getDetailInfo(true)
})
</script>

<template>
  <div class="p-center">
    <div class="main-con">
      <div class="order-detail" v-if="!skipDisplay">
        <div class="top-state">
          <div class="top-l">
            <div class="order-state">
              <span>{{t('afterSale.refundAfterSale')}}</span>
            </div>
            <div class="order-id">{{t('afterSale.orderNumber')}}：{{ orderDetail.orderCode }}</div>
          </div>
        </div>
        <div class="order-detail-box">
          <div class="listing">
            <div class="listing-top">
              <div class="listing-left">
                <div class="listing-tit">{{t('afterSale.commodityInfo')}}</div>
                <div class="listing-num">{{t('afterSale.quantity')}}</div>
              </div>
              <div class="listing-total">{{t('afterSale.subtotal')}}</div>
              <div class="listing-total">{{t('afterSale.state')}}</div>
            </div>
            <div class="list-product">
              <div class="product-item" v-for="(item, index) of orderDetail.details" :class="{disabled: item.state !== 1}">
                <div class="product-left">
                   <a-checkbox v-if="orderDetail.details.length !== 1" v-model:checked="item.checked" :disabled="item.state !== 1" @change="selectProduct"></a-checkbox>
                  <div class="product-img">
                    <img :src="item.image" alt="">
                    <div class="product-info">
                      <div class="product-tit-sku">
                        <div class="product-tit">{{ item.productName }}</div>
                        <div class="product-sku">{{ item.sku }}</div>
                      </div>
                      <div class="product-amount">{{currency}} {{ item.price }}</div>
                    </div>
                  </div>
                  <div class="product-num">{{ item.num }}</div>
                </div>
                <div class="product-total">{{currency}} {{ item.price * item.num }}</div>
                <div class="product-total" v-if="item.state === 1">{{t('afterSale.availableToApply')}}</div>
                <div class="product-total" v-if="item.state === 2">{{t('afterSale.afterSale')}}</div>
                <div class="product-total" v-if="item.state === 3">{{t('afterSale.afterSaleCompletion')}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="price-breakdown">
          <a-flex class="flex-box" justify="space-between" align="center"><span>{{t('afterSale.grossCommodityPrice')}}</span><span>{{currency}} {{orderDetail.totalPrice}}</span></a-flex>
          <a-flex class="flex-box" justify="space-between" align="center"><span>{{t('afterSale.promotionalOffer')}}</span><span>-{{currency}} {{orderDetail.couponPrice}}</span></a-flex>
          <a-flex class="flex-box" justify="space-between" align="center">
            <span>{{t('commodity.toOffset')}}</span>
            <span>-{{currency}} {{orderDetail.integralDeduct}}</span>
          </a-flex>
          <a-flex class="flex-box" justify="space-between" align="center"><span>{{t('afterSale.freight')}}</span><span>-{{currency}} {{orderDetail.totalPostage}}</span></a-flex>
          <a-flex class="flex-box" justify="space-between" align="center"><span>{{t('afterSale.commission')}}</span><span>-{{currency}} {{orderDetail.taxation}}</span></a-flex>
          <a-flex class="amount-due" justify="space-between" align="center"><span>{{t('afterSale.actualAmountPaid')}}</span><span>{{currency}} {{orderDetail.payPrice}}</span></a-flex>
        </div>
        <div class="form-box">
          <a-form
              :model="form"
              name="basic"
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
          >
            <a-form-item
                :label="t('afterSale.serviceType')"
                name="type-service"
                :colon="false"
                :rules="[{ required: false }]"
            >
              <a-flex class="type-service">
                <div class="type-item" :class="{active: form.serviceType === 0}" @click="changeType(0)">{{t('afterSale.refundOnly')}}</div>
                <div class="type-item" :class="{active: form.serviceType === 1}" @click="changeType(1)">{{t('afterSale.returnGoodsRefund')}}</div>
              </a-flex>
            </a-form-item>
            <a-form-item
                :label="t('afterSale.reasonForApplication')"
                name="reason-application"
                :colon="false"
                :rules="[{ required: false }]"
            >
              <a-space direction="vertical">
                <a-select
                    v-model:value="form.reasons"
                    style="width: 300px"
                    :options="reasonList"
                    class="reason-application"
                ></a-select>
              </a-space>
            </a-form-item>
            <a-form-item
                :label="t('afterSale.applicationInstructions')"
                name="reason-description"
                :colon="false"
                :rules="[{ required: false }]"
            >
              <a-textarea
                  v-model:value="form.explains"
                  :placeholder="t('afterSale.applicationInstructionsTip')"
                  :auto-size="{ minRows: 8, maxRows: 8 }"
              />
            </a-form-item>
            <a-form-item
                :label="t('afterSale.uploadCredentials')"
                name="upload-credentials"
                :colon="false"
                :rules="[{ required: false }]"
            >
              <div class="clearfix">
                <a-upload
                    :headers="requestHeaders"
                    v-model:file-list="fileList"
                    :action='uploadImgUrl'
                    multiple
                    :maxCount="4"
                    list-type="picture-card"
                    @preview="handlePreview"
                >
                  <div v-if="fileList.length < 4">
                    <CameraOutlined style="font-size: 32px"/>
                    <div style="margin-top: 8px">{{t('afterSale.uploadPhotos')}}</div>
                  </div>
                </a-upload>
                <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage"/>
                </a-modal>
                <div class="number-uploads">{{t('afterSale.inAll')}}<b>{{fileList.length}}</b>{{t('afterSale.severalPiecesOf')}}<b>{{4 - fileList.length}}</b>{{t('afterSale.piece')}}</div>
              </div>
            </a-form-item>
          </a-form>
        </div>
        <div class="submit-box">
          <div class="select-all checkbox">
             <a-checkbox @change="selectAll" v-model:checked="checkedAll">{{t('afterSale.selectAll')}}</a-checkbox>
          </div>
          <div class="ant-btn">
            <div class="money-box">{{t('afterSale.refundAmount')}}：{{currency}}{{orderDetail.payPrice}}</div>
            <div class="btn-item">
              <a-button class="line-btn" @click="cancelApplication">{{t('afterSale.cancel')}}</a-button>
            </div>
            <div class="btn-item">
              <a-button class="s-btn" @click="clickApplyForAfterSales" :loading="loadingBtn">{{t('afterSale.submit')}}</a-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="applyFor-success">
        <div class="applyFor-tit">{{t('afterSale.refundSuccessful')}}</div>
        <div class="applyFor-info">{{t('afterSale.submitSuccessfullyTip')}}</div>
        <div class="ant-btn">
          <a-button class="line-btn" @click="goToOrder">{{t('afterSale.viewOrder')}}</a-button>
          <a-button class="s-btn" @click="goToHome">{{t('afterSale.backToHomePage')}}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.p-center {
  .main-con {
    min-width: 1100px;
    margin: 45px auto;

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
          .disabled {
            opacity: 0.5;
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
            padding: 0 10px;
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
            .s-btn {
              border: 1rpx solid #262626;
            }
            button {
              width: 156px;
              height: 44px;
              justify-content: center;
            }
          }
        }
      }
    }
    .applyFor-success {
      text-align: center;
      .applyFor-tit {
        font-size: 16px;
        color: #262626;
        font-weight: 600;
      }
      .applyFor-info {
        font-size: 14px;
        color: #8C8C8C;
        margin: 6px 0 12px 0;
      }
      .ant-btn {
        width: auto;
        button {
          height: 44px;
          border-radius: 0;
          margin:0 6px;
          padding: 0 10px;
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

        .ant-steps-icon {
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
</style>
