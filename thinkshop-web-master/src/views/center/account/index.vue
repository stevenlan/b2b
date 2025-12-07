<script setup>
import UserMsg from "@/views/center/account/components/userMsg.vue";
</script>
<template>
  <div class="account">
    <user-msg/>
  </div>
</template>
<style lang="scss" scoped>
.account {
  position: relative;
  :deep(.e-input) {
    height: 44px;
    width: 400px;
  }
  :deep(.ant-input-affix-wrapper) {
    height: 58px;
    margin-bottom: 5px;
  }
  :deep(.p-item ) {
    margin-bottom: 0;
  }
}
</style>
