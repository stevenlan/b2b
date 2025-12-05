<template>
  <div class="c-layout">
    <router-view v-slot="{Component, route}">
      <Header/>
      <a-affix>
        <Classify v-if="!route.meta.hiddenClassify"/>
      </a-affix>
      <component :is="Component" :key="route.path" style="minHeight: calc(100vh - 280px);"/>
      <Footer v-if="!route.meta.hidderFooter"/>
    </router-view>
  </div>
</template>

<script setup>
import Header from './components/header.vue'
import Footer from './components/footer.vue'
import Classify from './components/classify.vue'

</script>

<style lang="scss" scoped>
.c-layout {
  background: #FFFFFF;
  .d-height {
    min-height: calc(100vh - 363px);
  }
}
</style>
