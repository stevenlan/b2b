<template>
  <section class="app-main">
    <section class="app-main-con">
      <router-view v-slot="{ Component, route }" :key="routeKey">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
          </keep-alive>
        </transition>
      </router-view>
      <iframe-toggle />
    </section>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import iframeToggle from "./IframeToggle/index"
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const route = useRoute()
const routeKey = computed(() => route.path + Math.random())
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #EDEFF5;
  padding: 16px;
  .app-main-con {
    min-height: calc(100vh - 50px);
    background: #FFFFFF;
    border-radius: 4px;
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>

