<template>
  <div class="order">
    <div class="address">
      <p class="title">{{$t('commodity.chooseAdd')}}</p>
      <div class="address-list" v-if="selectedAdressList.length">
        <div class="a-item" v-for="item in selectedAdressList" :key="item.addressId">
          <a-flex align="center" class="item-flex">
            <div class="item">
              <span>{{item.firstName}} {{item.lastName}}</span>
            </div>
            <div class="item">
              <p>{{item.province}}{{item.city}}{{item.detail}}</p>
              <p>{{item.phone}}，{{$t('commodity.postCode')}}({{item.postCode}})</p>
            </div>
            <div class="item">{{item.country}}</div>
            <div class="item">
              <span>{{item.isDefault===1?$t('commodity.dAddress')+' | ':''}}</span>
              <span @click="openAddressSelector">{{ $t('commodity.switch') }}</span>
            </div>
          </a-flex>
          <div class="tip-text" v-if="preOrder.addressValid===false&&!props.preLoading">*{{$t('commodity.unAdd')}}</div>
        </div>
        <div class="a-item">
          <a-button class="s-btn add-btn" @click="clickNewAddress(false)">
            <template #icon>
              <i class="iconfont icon-jia1"/>
            </template>
            {{$t('commodity.addAddress')}}
          </a-button>
        </div>
      </div>
      <div class="empty" v-else>
        <img alt="" :src="emptyAddress"/>
        <p>{{$t('commodity.noAdd')}}</p>
        <a-button class="s-btn add-btn" @click="clickNewAddress(false)">
          <template #icon>
            <i class="iconfont icon-jia1"/>
          </template>
          {{$t('commodity.addAddress')}}
        </a-button>
      </div>
    </div>
    <div class="product-list">
      <ul>
        <li>
          <a-flex justify="space-between">
            <p>{{$t('commodity.orderList')}}</p>
            <p>{{$t('commodity.num')}}</p>
            <p>{{$t('commodity.lTotal')}}</p>
          </a-flex>
        </li>
        <li v-for="(it ,i) in productList" :key="i">
          <a-flex>
            <div class="item">
              <a-flex :gap="12">
                <img :src="it.image || defaultGoodImg" alt=""/>
                <a-flex :vertical="true" justify="space-between">
                  <p>{{it.productName}}</p>
                  <p><span>{{$t('commodity.sku')}}：</span>{{it.sku}}</p>
                  <p><span>{{currency}}</span>{{formatPrice(it.price)}}</p>
                </a-flex>
              </a-flex>
            </div>
            <div class="item">{{it.num}}</div>
            <div class="item"><span>{{currency}}</span>{{formatPrice(it.num*it.price)}}</div>
          </a-flex>
        </li>
      </ul>
    </div>
    <div class="coupon">
      <p class="title" @click="couponExpand=!couponExpand">
        <span>
          {{$t('commodity.ableCoupon')}} ({{ couponList.length }})
        </span>
        <span :class="['icon', couponExpand?'expand':'']"></span>
      </p>
      <div class="coupon-con" v-if="couponExpand">
        <a-input
        :placeholder="$t('commodity.exchangeTip')"
          v-model:value.trim="couponCode"
        >
          <template #addonAfter>
            <span @click="getCoupon" class="cursor-p">{{$t('commodity.exchange')}}</span>
          </template>
        </a-input>
        <div v-if="couponList.length">
          <a-flex class="coupon-list" wrap="wrap">
            <a-flex
              :class="['item', 'cursor-p', item.checked?'active':'']"
              v-for="(item, i) in couponList"
              :key="i"
              align="center"
            >
              <div class="l-item" @click="selectCoupon(item)">
                {{item.couponType===1?`${currency}${item.couponValue}`:`${item.discount*10}%`}}
              </div>
              <div class="r-item" @click="selectCoupon(item)">
                <p>{{item.threshold?`${$t('commodity.conAmount')} ${currency}${item.threshold}`:$t('commodity.comCoupon')}}</p>
                <p>{{formatDateTime(item.expirationTime)}}{{$t('commodity.expir')}}</p>
              </div>
              <div class="selected" v-if="item.checked"/>
            </a-flex>
          </a-flex>
          <p class="tips" v-if="props.preOrder.couponPrice">
            {{$t('commodity.couponFir')}} 1 {{$t('commodity.couponSec')}}，{{$t('commodity.couponThir')}}{{currency}}{{props.preOrder.couponPrice}}
          </p>
        </div>
        <div v-else class="empty-coupon">
          <img :src="emptyCoupon"/>
          <p>{{ $t('commodity.noCoupon') }}</p>
        </div>
      </div>
    </div>
    <div class="integral">
      <p class="title">
        {{ $t('commodity.ablePoint') }} （{{preOrder.integralBalance}}）
      </p>
      <div v-if="preOrder.useIntegralOptions?.length" class="c-text">
        <a-checkbox v-model:checked="useIntegral" @change="refreshPreOder"/>
        <span>
          {{ $t('commodity.use') }}{{preOrder.useIntegralOptions[0]}}{{ $t('commodity.toOffset') }}{{preOrder.useIntegralOptions[1]}}
        </span>
      </div>
    </div>
    <add-address @rest="getAddressList" ref="addressRef"/>
    <a-modal
      v-model:open="open"
      :footer="null"
      :closable="false"
      @cancel="open=false"
      class="s-modal"
      width="390px"
    >
      <p class="m-title">{{ $t('commodity.switchAdd') }}</p>
      <div class="address-list">
        <div v-for="item in address" :key="item.addressId" :class="['address-item', item.checked?'active':'']">
          <div class="name">
            <a-checkbox v-model:checked="item.checked" @change="refreshAddress(item)"/>
            <span>{{item.firstName}} {{item.lastName}}</span>
          </div>
          <div class="info">
            <p>{{item.province}}{{item.city}}{{item.detail}}</p>
            <p>{{item.phone}}，{{$t('commodity.postCode')}}({{item.postCode}})</p>
            <p>{{item.country}}</p>
          </div>
          <div class="default-address" v-if="item.isDefault===1">{{ $t('commodity.dAddress') }}</div>
        </div>
      </div>
      <div>
        <a-flex :gap="15">
          <a-button class="s-btn c-gray" @click="open=false">{{$t('common.cancel')}}</a-button>
          <a-button class="s-btn" @click="confirmAddress">{{$t('common.confirm')}}</a-button>
        </a-flex>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import emptyAddress from '@/assets/images/empty_address.png'
import emptyCoupon from '@/assets/images/coupon_empty.png'
import AddAddress from "@/components/AddAddress.vue"
import {addressList} from '@/api/address'
import {queryCartCoupon, exChangeCoupon,createOrder} from '@/api/shopping'
import useSettingStore from '@/store/modules/setting'
import defaultGoodImg from '@/assets/images/default_good.png'
import {formatPrice, formatDateTime} from "@/utils"

const router = useRouter()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

const props = defineProps({
  preLoading: {
    type: Boolean,
    default:  false
  },
  preOrder: {
    type: Object,
    default: () => {}
  },
  query: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['reload'])

// 地址
const address = ref([])
const selectedAddressId = ref('')
// 购物车可用优惠券
const couponList = ref([])
// 优惠券兑换码
const couponCode = ref('')
const couponExpand = ref(true)
// 收地地址
const open = ref(false)
// 积分
const useIntegral = ref(false)

// 新增地址
const addressRef = ref()
function clickNewAddress(item) {
  addressRef.value.show(item)
}

const productList = computed(() => {
  const {carts} = props.preOrder
  if(carts?.length) {
    carts.forEach(it => {
      it.image = it.image.split(',')[0]
    })
  }
  return carts || []
})
const selectedAdressList = computed(() => {
  if(!selectedAddressId.value) return []
  return address.value.filter(it=>it.addressId===selectedAddressId.value)
})
// 获取地址列表
function getAddressList(flag) {
  addressList({pageNum: 1, pageSize: 99}).then(r => {
    const { rows } = r;
    let defaultFound = false;

    if (flag) {
      rows.forEach(it => {
        if (it.isDefault === 1) {
          it.checked = true;
          selectedAddressId.value = it.addressId;
          defaultFound = true;
        }
      });
    }

    // 如果没有找到默认项，并且数组不为空
    if (!defaultFound && rows.length > 0) {
      selectedAddressId.value = rows[0].addressId;
    }

    address.value = rows;
  });
}
// 开启地址选择器
function openAddressSelector() {
  address.value.forEach(it => {
    it.checked = it.addressId===selectedAddressId.value
  })
  open.value = true
}
// 勾选地址
function refreshAddress(item) {
  const {checked, addressId} = item
  if(checked) {
    address.value.forEach(it => {
      if(it.addressId!==addressId) it.checked = false
    })
  }
}
// 确认勾选地址
function confirmAddress() {
  const chooseItem = address.value.find(it=>it.checked)
  if(chooseItem) {
    selectedAddressId.value = chooseItem.addressId
    refreshPreOder()
    open.value = false
  } else {
    proxy.$message.error(proxy.$t('commodity.addressRequired'))
  }
}
// 获取已选择的地址和优惠券
function getCouponAddress() {
  const selectedCoupon = couponList.value.find(it=>it.checked)
  const ob = {}
  // 地址
  if(selectedAddressId.value) ob.addressId = selectedAddressId.value
  // 优惠券
  if(selectedCoupon) {
    ob.couponId = selectedCoupon.detailId
  } else {
    ob.isDefaultCoupon = 0
  }
  // 积分
  if(useIntegral.value) {
    ob.payIntegral = props.preOrder.useIntegralOptions[0]
  }
  return ob
}
// 地址和或优惠券变动时， 更新订单状态
function refreshPreOder() {
  emits('reload', getCouponAddress())
}
// 可用优惠券
function queryCoupon() {
  const {cartIds} = props.query
  queryCartCoupon({cartIds}).then(r => {
    const {rows=[]} = r
    if(!r.total) couponExpand.value = false
    rows.forEach(it => {
      it.checked = it.detailId === props.preOrder.couponId
    })
    couponList.value = rows
    console.log(couponList.value, props.preOrder, 'popup')
  })
}
// 兑换优惠券
function getCoupon() {
  if(!couponCode.value) return  proxy.$message.warn(proxy.$t('commodity.exchangeTip'))
  exChangeCoupon(couponCode.value).then(r => {
    queryCoupon()
  })
}
// 选择优惠券
function selectCoupon(item) {
  couponList.value.forEach(it => {
    if(it.detailId===item.detailId) {
      it.checked = !it.checked
    } else {
      it.checked = false
    }
  })
  refreshPreOder()
}
// 提交订单
function submit() {
  const {cartIds} = props.query
  const {addressValid} = props.preOrder
  const {addressId} = getCouponAddress()
  if(!addressId) return proxy.$message.error(proxy.$t('commodity.addressRequired'))
  if(!addressValid) return proxy.$message.error(proxy.$t('commodity.unAdd'))
  createOrder({cartIds: cartIds.split(','), ...getCouponAddress()}).then(r => {
    router.push({path:'/shopping', query: {orderId: r.data}})
  })
}

defineExpose({submit})

getAddressList(true)
queryCoupon()
</script>

<style scoped lang="scss">
.order {
  .title {
    font-weight: 600;
    font-size: 16px;
  }
  .address {
    margin-bottom: 32px;
    .s-btn {
      width: 158px;
    }
    .empty {
      text-align: center;
      padding-top: 32px;
      img {
        width: 100px;
        height: 100px;
      }
      p {
        font-size: 14px;
        color: #8C8C8C;
        margin: 4px 0 16px;
      }
    }
    .address-list {
      .a-item {
        margin-top: 12px;
        &:last-child {
          text-align: right;
        }
        .tip-text {
          font-size: 12px;
          color: #FD2A53;
          line-height: 14px;
        }
        .item-flex {
          height: 80px;
          border-radius: 2px;
          border: 2px solid #262626;
          padding: 0 24px 0 16px;
          .item {
            flex: 1;
            font-size: 14px;
            &:nth-of-type(1) {
              span {
                font-weight: 600;
                margin-left: 10px;
              }
            }
            &:nth-of-type(2) {
              flex: 2.5;
              p:first-child {
                margin-bottom: 8px;
              }
            }
            &:nth-of-type(4) {
              color: #8C8C8C;
              text-align: right;
              span {
                &:last-child {
                  color: #262626;
                  text-decoration-line: underline;
                  line-height: 16px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
  .product-list {
    ul {
      li {
        padding: 16px 0;
        border-bottom: 1px #E5E5E5 solid;
        &:first-child {
          p {
            flex: 1;
            font-weight: 600;
            font-size: 16px;
            &:first-child {
              flex: 2;
            }
            &:last-child {
              text-align: right;
            }
          }
        }
        &:nth-child(n+2) {
          .item {
            flex: 1;
            height: 110px;
            font-size: 14px;
            font-weight: 600;
            img {
              width: 98px;
              height: 110px;
            }
            :deep(.ant-flex) {
              height: 110px;
              flex: 1;
              p {
                flex: 1;
                &:nth-of-type(2) {
                  span {
                    color: #666666;
                  }
                  font-weight: 400;
                  font-size: 12px;
                }
                &:nth-of-type(3) {
                  align-content: flex-end;
                }
              }
            }
            &:nth-of-type(1) {
              flex: 2;
            }
            &:nth-of-type(3) {
              text-align: right;
            }
          }
        }
      }
    }
  }

  .coupon {
    margin-top: 32px;
    .title {
      span {
        &:nth-of-type(1) {
          margin: 0 5px;
        }
        &:nth-of-type(2) {
          display: inline-block;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 8px 8px 0 8px;
          border-color: #262626 transparent transparent transparent;
          transition: all .5s;
          &.expand {
            transform: rotate(180deg);
          }
        }
      }
    }
    .empty-coupon {
      text-align: center;
      padding: 32px 0;
      img {
        width: 100px;
        height: 100px;
      }
      p {
        font-size: 14px;
        color: #8C8C8C;
        margin: 4px 0 16px;
      }
    }
    .coupon-con {
      margin-top: 12px;
      :deep(.ant-input-group-wrapper){
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #262626;
        padding: 6px  0;
        width: 388px;
        margin-bottom: 12px;
        .ant-input-wrapper {
          .ant-input {
            border: 0;
            outline: none;
            padding: 0 11px;
            &:hover,  &:focus, &:focus-visible {
              border: none;
              border-radius: 0;
              outline: none;
              box-shadow: none;
            }
          }
          .ant-input-group-addon {
            border: 0;
            background: none;
            border-left: 1px solid #d9d9d9;
          }
        }
      }
      .tips {
        font-size: 12px;
        color: #8C8C8C;
      }
      .coupon-list {
        .item {
          margin: 0 28px 10px 0;
          width: 388px;
          height: 102px;
          border-width: 1px 1px 1px 4px;
          border-color: #666666;
          background: #FAFAFA;
          border-style: solid;
          box-sizing: border-box;
          position: relative;
          color: #666666;
          &::before {
            content: '';
            display: block;
            width: 14px;
            height: 7px;
            border: 1px #666666 solid;
            border-radius: 0 0 50% 50%/0 0 100% 100% ;
            border-top: none;
            background: #FFFFFF;
            left: 103px;
            top: -1px;
            position: absolute;
          }
          &::after {
            content: '';
            display: block;
            width: 14px;
            height: 7px;
            border: 1px #666666 solid;
            border-radius: 50% 50% 0 0/100% 100% 0 0;
            border-bottom: none;
            background: #FFFFFF;
            left: 103px;
            bottom: -1px;
            position: absolute;
          }
          .l-item {
            width: 110px;
            box-sizing: border-box;
            border-right: 1px #8C8C8C dashed;
            height: 100%;
            text-align: center;
            line-height: 102px;
            font-weight: 600;
            font-size: 24px;
          }
          .r-item {
            height: 100%;
            width: calc(100% - 110px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            p {
              font-size: 12px;
              text-indent: 16px;
              &:nth-child(1) {
                margin-bottom: 16px;
                font-weight: 600;
                font-size: 14px;
              }
              &:nth-child(2) {
                color: #666666;
              }
            }
          }
          .selected {
            position: absolute;
            right: -12px;
            top: -17px;
            width: 0;
            height: 0;
            display: block;
            border-style: solid;
            border-width:20px 10px 20px 20px;
            border-color: transparent transparent transparent #262626;
            transform: rotate(-45deg);
            &::before {
              box-sizing: border-box;
              position: absolute;
              inset-inline-start: 21.5%;
              display: table;
              width: 5.7142857142857135px;
              height: 9.142857142857142px;
              border: 2px solid #FFFFFF;
              border-top: 0;
              border-inline-start: 0;
              content: '';
              opacity: 1;
              transform: rotate(90deg) scale(1) translate(-50%, -50%);
              transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
              top: -2px;
              left: -19px;
            }
          }
          &.active {
            color: #262626;
            border-color: #262626;
            &::before, &::after {
              border-color: #262626;
            }
          }
        }
      }
    }
  }
  .integral {
    margin-top: 32px;
    .c-text {
      margin-top: 12px;
      font-size: 12px;
      color: #8C8C8C;
      :deep(.ant-checkbox-wrapper) {
        vertical-align: middle;
      }
    }
  }
}
.s-modal  {
  :deep(.ant-modal-content) {
    border-radius: 2px;
  }
  .m-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
  .address-list {
    max-height: 300px;
    overflow: scroll;
    margin-bottom: 20px;
    &::-webkit-scrollbar {
      display: none; /* 或 width: 0; height: 0; */
    }
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;
  }
  .address-item {
    padding: 16px;
    border-radius: 2px;
    border: 2px solid #8C8C8C;
    margin-bottom: 8px;
    font-size: 12px;
    &.active {
      border-color: #262626;
    }
    :deep(.ant-checkbox-wrapper) {
      vertical-align: middle;
      margin-right: 10px;
    }
    .info {
      margin-top: 5px;
      p:last-child {
        margin-top: 16px;
      }
    }
    .default-address {
      margin-top: 16px;
      color: #8C8C8C;
    }
  }
}
</style>
