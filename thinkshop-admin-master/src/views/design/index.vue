<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="it in tabList"
        :key="it.field"
        :label="it.label"
        :name="it.field"
      >
        <component :is="it.comp" v-if="it.field===activeName"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import Banner from './banner.vue'
import Header from './header.vue'
import Footer from './footer.vue'
import ImageText from './imageText.vue'
import Video from './video.vue'
import CommodityGroup from './commodityGroup.vue'

const activeName = ref('banner')
const tabList = shallowRef([
  {label: '首页banner', field: 'banner', comp: Banner},
  {label: '页眉', field: 'header', comp: Header},
  {label: '页脚', field: 'footer', comp: Footer},
  {label: '图文', field: 'imageText', comp: ImageText},
  {label: '视频', field: 'video', comp: Video},
  {label: '商品组合', field: 'commodityGroup', comp: CommodityGroup}
])
</script>

<style lang="scss" scoped>

</style>