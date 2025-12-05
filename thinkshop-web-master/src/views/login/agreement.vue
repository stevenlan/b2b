<template>
  <div class="agreement">
    <div class="main-con">
      <div v-html="dealHtml"/>
    </div>
  </div>
</template>

<script setup>
import {userDeal} from '@/api/login'

const dealHtml = ref('')


function getDeal() {
  userDeal({type: 1}).then(r => {
    dealHtml.value = r.data
  })
}
getDeal()
</script>

<style scoped lang="scss">
.agreement {
  height: calc(100vh - 288px);
  .main-con {
    width: 800px;
    margin: 30px auto;
  }
}
</style>
