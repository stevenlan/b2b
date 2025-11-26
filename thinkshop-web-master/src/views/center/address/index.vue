<script setup>
import { h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue';
import AddAddress from "@/components/AddAddress.vue";
import {addressList, defaultAddress, deleteAddress} from "@/api/address.js";
import {message} from "ant-design-vue";
import noDataImg from '@/assets/images/empty/noAddress.png';
import Spin from "@/utils/spin.js";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
// 获取地址列表
const addressListData = ref([])
function getAddressList() {
  const spinIntance = Spin.service({target: '#loading'});
  addressList().then(res => {
    const {rows} = res
    addressListData.value = rows;
    spinIntance.close()
  })
}

// 设置默认地址
function setDefaultAddress(nonDefault, id) {
  if (nonDefault) {
    defaultAddress(id).then(res => {
      message.success(t('userCenter.modifySuccessfully'))
      getAddressList()
    }).catch(() => message.error(t('userCenter.modificationFailure')))
  }
}

// 删除当前地址
function deleteCurrentAddress(id) {
  deleteAddress(id).then(() => {
    message.success(t('addressManagement.successfullyDeleted'))
    rest()
  }).catch(() => message.error(t('addressManagement.deletionFailure')))
}

// 新增地址
const addressRef = ref()
function clickNewAddress(item) {
  addressRef.value.show(item)
}

// 重新请求
function rest() {
  getAddressList()
}
onMounted(() => {
  getAddressList()
})
</script>
<template>
  <div class="address">
    <h3>{{t('addressManagement.title')}}</h3>
    <div class="address-box" id="loading">
      <div v-if="addressListData.length > 0">
        <div class="address-item" v-for="(item, index) in addressListData" :key="item.addressId">
          <div class="address-info">
            <div class="user-name">{{item.firstName}} {{item.lastName}}</div>
            <div class="contact-address">
              <div class="detailed-address">{{item.province}}{{item.city}}{{item.detail}}</div>
              <div class="contact">
                <div class="contact-phone">{{item.phone}}，</div>
                <div class="contact-postcode">{{t('addressManagement.postcode')}}({{item.postCode}})</div>
              </div>
            </div>
            <div class="country-region">{{item.country}}</div>
          </div>
          <div class="controls">
            <span class="controls-default" @click="setDefaultAddress(item.isDefault !== 1, item.addressId)" :class="{default: item.isDefault === 1}">{{item.isDefault === 1 ? t('addressManagement.defaultAddress') : t('addressManagement.setDefaultAddress')}}</span>
            <span class="controlse-dit" @click="clickNewAddress(item)">{{t('addressManagement.modifyAddress')}}</span>
            <a-popconfirm
                :title="t('addressManagement.whetherDeleteAddress')"
                :ok-text="t('addressManagement.affirm')"
                :cancel-text="t('addressManagement.cancel')"
                @confirm="deleteCurrentAddress(item.addressId)"
            >
              <span class="controls-del">{{t('addressManagement.delete')}}</span>
            </a-popconfirm>
          </div>
        </div>
        <div class="add-address" @click="clickNewAddress(false)">
          <PlusOutlined />
          <span>{{t('addressManagement.addAddress')}}</span>
        </div>
      </div>
      <div v-else class="empty">
        <a-empty
            :image="noDataImg"
            :description="t('addressManagement.noAddress')"
            :image-style="{height: '100px'}">
          <div class="ant-btn" @click="clickNewAddress(false)">
            <a-button :icon="h(PlusOutlined)" class="line-btn">{{t('addressManagement.addAddress')}}</a-button>
          </div>
        </a-empty>
      </div>
    </div>
  </div>
  <add-address @rest="rest" ref="addressRef"></add-address>
</template>

<style lang="scss" scoped>
.address {
  .address-box {
    position: relative;
  }
  .ant-btn {
    width: 158px;
    margin: 0 auto;
    border-color: #262626;
    height: 44px;
  }
  h3 {
    margin-bottom: 30px;
  }
  .address-item {
    padding: 15px 24px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #8C8C8C;
    margin-bottom: 12px;
    .address-info {
      display: flex;
      align-items: center;
      .user-name {
        width: 200px;
        font-size: 14px;
        color: #262626;
        font-weight: 600;
      }
      .contact-address {
        width: 500px;
        color: #262626;
        font-size: 14px;
        font-weight: 400;
        .contact {
          display: flex;
          align-items: center;
        }
        .detailed-address {
          margin-bottom: 8px;
        }
      }
    }
    .controls {
      span {
        font-size: 14px;
        color: #262626;
        font-weight: 400;
        padding-right: 10px;
        margin-right: 10px;
        border-right: 2px solid #8C8C8C;
        cursor: pointer;
      }
      .default {
        color: #8C8C8C;
      }
      :last-child {
        border: none;
      }
    }
  }
  .add-address {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 158px;
    height: 44px;
    border-radius: 2px;
    border: #262626 solid 1px;
    color: #262626;
    cursor: pointer;
    span {
      margin-left: 5px;
    }
  }
}
</style>
