<script setup>
import {integralRule} from '@/api/integral'

const ruleMsg = ref('')

function init() {
  integralRule().then(r => {
    ruleMsg.value = r.msg
  })
}

init()
</script>

<template>
  <div class="main-con w-width">
    <p class="integral-title">{{ $t('integral.rule') }}</p>
    <div v-html="ruleMsg"/>
  </div>
</template>

<style scoped lang="scss">
.main-con {
  margin: 32px auto 100px;
  min-width: 1100px;
}
.integral-title {
  font-size: 20px;
  color: #262626;
  margin-bottom: 24px;
}
</style>