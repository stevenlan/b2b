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
import Record from './record.vue'
import Rules from './rules.vue'

const activeName = ref('record')
const tabList = shallowRef([
  {label: '积分记录', field: 'record', comp: Record},
  {label: '积分规则', field: 'rules', comp: Rules},
])
</script>