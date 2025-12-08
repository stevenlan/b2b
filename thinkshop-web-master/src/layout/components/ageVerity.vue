<template>
  <div>
    <a-modal v-model:open="useUser.showAgeVerity" :width="850" title="" :footer="null" :closable="false" @ok="handleOk">
      <div class="verity">
        <div class="w-width main-con h-flex" style="justify-content: center;">
          <img class="logo cursor-p" :src="useSetting.design.pageTopUrl || logo"/>
        </div>
        <h1 style="margin-top: 30px;margin-bottom: 0;">Please Verify Your Age</h1>
        <h2 style="margin-bottom: 80px;">WARNING: This product contains nicotine. Nicotine is an addictive chemical.</h2>
        <h2 style="font-width: bold;">Are you 21 or older?</h2>
        <a-button type="text" class="verity-btn" block @click="handleOk" align="center">
          YES, l am over 21
        </a-button>
        <a-button type="text" class="verity-btn no" block @click="handleNo" align="center">
          NO, lam under 21
        </a-button>
      </div>
    </a-modal>

  </div>
</template>

<script setup>
import useSettingStore from "@/store/modules/setting.js";
import logo from '@/assets/images/common/logo.png'
import useUserStore from "@/store/modules/user.js";
const useUser = useUserStore()
const useSetting = useSettingStore()
function handleOk(){
  useUser.handleVerityComplete();
}
function handleNo(){
}
</script>

<style scoped lang="scss">
.verity{
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.verity-btn {
  margin-top: 16px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: #100;
  border-color: #100;
  color: #FFFFFF;
  width: 290px;
}
.no{
  background: #FFFFFF;
  color: #000000;
}
:global(.ant-modal-content) {
  padding: 90px 20px !important;
}
</style>
