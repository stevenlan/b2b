<script setup>
import {addAddress, getAcquisitionArea, modifyAddress} from "@/api/address.js";
import countryRegionData from '@/assets/data/area.json'; // 国家地区

import {message} from "ant-design-vue";
import { useI18n} from 'vue-i18n';
const { t } = useI18n();
const openValue = ref(false);
function cancel(e) {
  restForm()
  openValue.value = false;
};
// 重置数据
function restForm() {
  countryList.value = []
  provinceList.value = []
  formData.value = {}
  formRef.value?.resetFields();
}
const email = ref('')
const password = ref('')
const countryId = ref('')

function show(item) {
  restForm()
  if (item) {
    formData.value = JSON.parse(JSON.stringify(item));
    if (formData.value.addressId) {
      const selectedCountry = countryList.find(country => country.code === formData.value.countryId);
      if (selectedCountry) {
        provinceList.value = selectedCountry.regions;
      }
    }
  }
  openValue.value = true
}

// 提交表单
const formData = ref({})
const rules = ref({
  firstName: [{
    required: true,
    message: t('addressManagement.inputName'),
    trigger: 'change',
  }],
  lastName: [{
    required: true,
    message: t('addressManagement.inputSurname'),
    trigger: 'change',
  }],
  phone: [{
    required: true,
    message: t('addressManagement.inputPhoneNumber'),
    trigger: 'change',
  }],
  detail: [{
    required: true,
    message: t('addressManagement.inputDetailAddress'),
    trigger: 'change',
  }],
  city: [{
    required: true,
    message: t('addressManagement.inputCity'),
    trigger: 'change',
  }],
  country: [{
    required: true,
    message: t('addressManagement.selectCountry'),
    trigger: 'change',
  }],
  province: [{
    required: true,
    message: t('addressManagement.selectProvince'),
    trigger: 'change',
  }],
  postCode: [{
    required: true,
    message: t('addressManagement.inputPostcode'),
    trigger: 'change'
  }],
})
const formRef = ref()
function submit() {
  formRef.value.validate().then(() => {
    if (formData.value.addressId) {
      modifyAddress(formData.value).then((res) => {
        message.success(t('addressManagement.editSuccessful'))
        openValue.value = false;
        emit('rest')
      }).catch(() => {
        message.error(t('addressManagement.editFailed'))
      })
    } else {
      addAddress(formData.value).then((res) => {
        message.success(t('addressManagement.addSuccessful'))
        openValue.value = false;
        emit('rest')
      }).catch(() => {
        message.error(t('addressManagement.addFailed'))
      })
    }
  }).catch(error => {
    console.log('error', error);
  });
}
// 获取国家地区
const countryList = countryRegionData // 国家列表
// 选择国家
const provinceList = ref([]) // 省州列表数据
function changeCountry(name)  {
  formData.value.province = ''
  formData.value.provinceId = null
  const selectedCountry = countryList.find(country => country.name === name);
  if (selectedCountry) {
    formData.value.countryId = selectedCountry.code
    provinceList.value = selectedCountry.regions;
  }
}
// 选择省份/州
function changeProvince(name) {
  const selectedProvince = provinceList.value.find(province => province.name === name);
  if (selectedProvince) {
    formData.value.provinceId = selectedProvince.code
  }
}

const emit = defineEmits(['rest'])
defineExpose({
  show
})
</script>

<template>
  <div class="address-modal">
    <a-modal
        v-model:open="openValue"
        title=""
        @ok="cancel"
        :centered="true"
        :footer="null"
    >
      <div class="add-address">
        <h3>{{formData.addressId ? t('addressManagement.modifyAddress') : t('addressManagement.addAddress')}}</h3>
        <div class="add-address-form">
          <a-form
              :model="formData"
              :rules="rules"
              ref="formRef"
          >
            <a-form-item name="firstName">
              <div class="e-cell">
                <c-input v-model:value="formData.firstName" :placeholder="`${t('addressManagement.firstName')}*`" class="e-input"/>
              </div>
            </a-form-item>
            <a-form-item name="lastName">
              <c-input v-model:value="formData.lastName" :placeholder="`${t('addressManagement.lastName')}*`" class="e-input" />
            </a-form-item>
            <a-form-item name="phone">
              <c-input v-model:value="formData.phone" :placeholder="`${t('addressManagement.mobilePhoneNumber')}*`" class="e-input" />
            </a-form-item>
            <a-form-item name="detail">
              <c-input v-model:value="formData.detail" :placeholder="`${t('addressManagement.detailedAddress')}*`" class="e-input" />
            </a-form-item>
            <a-form-item name="city">
              <c-input v-model:value="formData.city" :placeholder="`${t('addressManagement.city')}*`" class="e-input" />
            </a-form-item>
            <a-form-item name="country">
              <a-select
                  ref="select"
                  show-search
                  :placeholder="`${t('addressManagement.nation')}*`"
                  v-model:value="formData.country"
                  @change="changeCountry"
              >
                <a-select-option v-for="item of countryList" :value="item.name" :key="item.code">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="province">
              <a-select
                  ref="select"
                  show-search
                  :placeholder="`${t('addressManagement.provinceState')}*`"
                  v-model:value="formData.province"
                  @change="changeProvince"
              >
                <a-select-option v-for="item of provinceList" :value="item.name" :key="item.code">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="postCode">
              <c-input v-model:value="formData.postCode" :placeholder="`${t('addressManagement.postcode')}*`" class="e-input" />
            </a-form-item>
            <div class="btn-box">
              <div class="button btn-cancel" @click="cancel">{{t('addressManagement.cancel')}}</div>
              <div class="button btn-save" @click="submit">{{t('addressManagement.affirm')}}</div>
            </div>
          </a-form>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.add-address {
  h3 {
    width: 100%;
    margin: 0 auto 50px auto;
    text-align: center;
  }
  .add-address-form {
    .save-btn {
      width: 100px;
      height: 44px;
      color: #ffffff;
      background: #262626;
      margin-bottom: 40px;
    }
  }
  .e-cell {
    position: relative;
  }
  :deep(.e-input) {
    height: 44px;
  }
  :deep(.ant-input-affix-wrapper) {
    height: 58px;
    margin-bottom: 5px;
  }
  :deep(.p-item ) {
    margin-bottom: 0;
  }
  :deep(.add-address-form ) {
    .ant-select-selector {
      height: 44px;
      display: flex;
      align-items: center;
    }
  }
  .btn-box {
    display: flex;
    justify-content: space-between;
    .button {
      text-align: center;
      box-sizing: border-box;
      width: 50%;
      height: 44px;
      line-height: 44px;
      background: #F5F5F5;
      border-radius: 2px;
      font-weight: 400;
      font-size: 14px;
      color: #262626;
      cursor: pointer;
    }

    .btn-cancel {
      margin-right: 20px;
    }

    .btn-save {
      background: #262626;
      color: #FFFFFF;
    }
  }
}
</style>
