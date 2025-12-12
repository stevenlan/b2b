<template>
  <svg class="svg-icon" inert>
    <use :xlink:href="`#${iconName}`"></use>
  </svg>
</template>

<script setup>
import '@/assets/iconfont/iconfont.js'
defineProps({
  iconName: {
    type: String,
    default: ''
  }
})

</script>

<style lang="scss" scoped>
.svg-icon {
  width: 32px;
  height: 32px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
