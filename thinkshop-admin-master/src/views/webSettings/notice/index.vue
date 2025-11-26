<template>
  <div class="p24">
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
import Announcement from './announcement.vue'
import Message from './message.vue'

const activeName = ref('announcement')
const tabList = shallowRef([
  {label: '通知公告', field: 'announcement', comp: Announcement},
  {label: '系统消息', field: 'message', comp: Message},
])
</script>
