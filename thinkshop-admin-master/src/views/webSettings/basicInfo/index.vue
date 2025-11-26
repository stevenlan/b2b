<script setup>
import {useDict} from "@/utils/dict.js";
import { getDicts } from '@/api/system/dict/data'
import {getToken} from "@/utils/auth.js";
import {changeWebsitesetting, getWebsitesetting} from "@/api/websiteSet/index.js";
import { ElMessage } from 'element-plus'
const {proxy} = getCurrentInstance()
const { sys_currency } = useDict('sys_currency')
const { sys_time_zone } = useDict('sys_time_zone')
const { sys_language } = useDict('sys_language')
import countryRegionData from '@/assets/data/area.json'; // 国家地区
const currentArea = ref([])
const formData = ref({})
const rules = ref({
  websiteName: [{ required: true, message: "网站名称不能为空", trigger: "blur" }],
  websiteLogo: [{ required: true, message: "请上传网站logo", trigger: "blur" }],
  currencyCode: [{ required: true, message: "请选择货币", trigger: "change" }],
  timeZone: [{ required: true, message: "请选择网站时区", trigger: "change" }],
  languageCode: [{ required: true, message: "请选择网站语言", trigger: "change" }],
  addressUsername: [{ required: true, message: "请输入名称", trigger: "blur" }],
  addressNation: [{ required: true, message: "请选择国家地区", trigger: "change" }],
  addressProvince: [{ required: true, message: "请选择省/州", trigger: "change" }],
  addressCity: [{ required: true, message: "请输入城市名", trigger: "blur" }],
  addressDetails: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  addressPhoneNumber: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  addressPostcode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
})
// 上传类目图片
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
// 上传配置
const uploadConfig = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})

// 获取国家地区
const countryList = countryRegionData // 国家列表
const cityOptions = ref([])
// 选择国家
function changeLanguage() {
  formData.value.addressProvince = ''
  const selectedCountry = countryList.find(country => country.code === formData.value.addressNation);
  if (selectedCountry) {
    currentArea.value = selectedCountry.regions;
  }
}
// 上传图片
function handleImageSuccess(response) {
  formData.value.websiteLogo = response.data.url
}
function beforeImgUpload(rawFile) {
  if(rawFile.size / 1024 / 1024 > 2) {
    proxy.$modal.msgError('类目图片大小不能超过2M!')
    return false;
  }
}

// 提交表单
const formRef = ref()
const loading = ref(false)
function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      let matchedCurrency = sys_currency.value.find(currency => currency.value === formData.value.currencyCode);
      if (matchedCurrency) {
        formData.value.currencySymbol = matchedCurrency.remark;
      }
      loading.value = true
      changeWebsitesetting(formData.value).then(res => {
        ElMessage.success('保存成功')
        loading.value = false
      }).catch(() => {
        ElMessage.success('保存失败')
        loading.value = false
      })
    }
  })
}
function getWebInfo() {
  getWebsitesetting().then((res) => {
    formData.value = res.data
    const selectedCountry = countryList.find(country => country.code === formData.value.addressNation);
    if (selectedCountry) {
      currentArea.value = selectedCountry.regions;
    }
  }).catch(() => {
  })
}
onMounted(() => {
  getWebInfo()
})
</script>

<template>
  <div class="app-container">
    <div class="top-btn">
      <h3>基本信息</h3>
      <el-button v-loading="loading" type="primary" @click="submit">保 存</el-button>
    </div>
    <div class="basic-info">
      <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="网站名称" prop="websiteName">
          <el-input style="width: 300px" v-model="formData.websiteName" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="logo" prop="websiteLogo">
          <el-upload
              accept="'.png, .jpeg, .png, .jpg, .webp'"
              :headers="uploadConfig.headers"
              :action="uploadImgUrl"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImgUpload"
              class="img-uploader"
          >
            <img v-if="formData.websiteLogo" :src="formData.websiteLogo" class="img" />
            <el-icon v-else class="img-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <p class="logo-describe">LOGO为网站的缩略标识，会展示在浏览器标签、地址栏左边和收藏夹，一般尺寸为32x32px</p>
        <h3>常规配置</h3>
        <div class="form-box">
          <el-row class="form-row">
          </el-row>
          <el-row :gutter="20" class="form-row">
            <el-col :span="8">
              <div class="title">货币单位及符号<span>此符号作为网站以及管理端货币符号</span></div>
              <el-form-item label="" prop="currencyCode" label-width="0">
                <el-select
                    v-model="formData.currencyCode"
                    placeholder="请选择"
                    style="width: 100%"
                >
                  <el-option
                      v-for="item in sys_currency"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="title">网站时区<span>网站所有时间都根据此时区统计（默认北京时间）</span></div>
              <el-form-item label="" prop="timeZone" label-width="0">
                <el-select
                    v-model="formData.timeZone"
                    placeholder="请选择"
                    style="width: 100%"
                >
                  <el-option
                      v-for="item in sys_time_zone"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="title">网站语言<span>客户端语言根据此语言展示（默认ENGLISH）</span></div>
              <el-form-item label="" prop="languageCode" label-width="0">
                <el-select
                    v-model="formData.languageCode"
                    placeholder="请选择"
                    style="width: 100%"
                >
                  <el-option
                      v-for="item in sys_language"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <h3>联系地址<span>此地址作为默认退货邮寄地址。</span></h3>
        <div class="form-box contact-address">
          <el-row :gutter="20" class="form-row">
            <el-col :span="8">
              <el-form-item label="名称:" prop="addressUsername">
                <el-input v-model="formData.addressUsername" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国家/地区" prop="addressNation">
                <el-select
                    v-model="formData.addressNation"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="changeLanguage"
                >
                  <el-option
                      v-for="item in countryList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省份/州" prop="addressProvince">
                <el-select
                    v-model="formData.addressProvince"
                    placeholder="请选择"
                    style="width: 100%"
                >
                  <el-option
                      v-for="item in currentArea"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="城市:" prop="addressCity">
                <el-input v-model="formData.addressCity" placeholder="请输入城市名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址:" prop="addressDetails">
                <el-input v-model="formData.addressDetails" placeholder="请输入详细地址" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号:" prop="addressPhoneNumber">
                <el-input v-model="formData.addressPhoneNumber" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮编:" prop="addressPostcode">
                <el-input v-model="formData.addressPostcode" placeholder="请输入邮编" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-uploader {
  .img {
    width: 80px;
    height: 80px;
    display: block;
  }
  :deep(.el-upload) {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: .2s;
    &:hover {
      border-color: #409eff;
    }
  }
  .el-icon.img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
  }
}
.basic-info {
  .logo-describe {
    font-size: 12px;
    color: #999999;
    padding-left: 100px;
  }
  .form-box {
    .form-row {
      margin-bottom: 25px;
      .title {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
        margin-bottom: 10px;
        span {
          display: block;
          color: #999999;
          padding-top: 8px;
        }
      }
    }
  }
  :deep(.contact-address) {
    .el-form-item {
      margin-bottom: 24px;
    }
  }
  .address-describe {
    font-size: 12px;
    color: #999999;
    margin-bottom: 10px;
  }
}
.app-container {
  padding: 24px 32px;
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
    span {
      font-weight: 400;
      font-size: 12px;
      color: #8C8C8C;
      padding-left: 8px;
    }
  }
  .top-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      width: 40%;
      background: linear-gradient( 90deg, #F5F6FA 0%, rgba(245,246,250,0) 100%);
      height: 64px;
      line-height: 64px;
      color: #262626;
      font-size: 16px;
    }
    button {
      width: 120px;
      height: 40px;
    }
  }
}
</style>

