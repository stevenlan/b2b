<template>
  <div :class="['c-input', cValue || isFocus?'active':'']">
    <span class="tag" v-show="cValue || isFocus">{{props.placeholder}}</span>
    <el-input
      v-if="props.type==='text'||'password'"
      v-model.trim="cValue"
      :placeholder="props.placeholder"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
      auto-complete="off"
      :type="showPassword?'password':'text'"
      @keyup.enter="emit('handleKeyup')"
    >
      <template #suffix>
        <el-icon
          class="cursor-p"
          v-if="type==='password'"
          @click="showPassword=!showPassword"
        >
          <component :is="rightIcon"/>
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { View, Hide } from '@element-plus/icons-vue'

const props = defineProps({
  value: String || Object,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  },
  funIcon: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:value', 'handleKeyup'])

const isFocus = ref(false)
const showPassword = ref(props.type==='password')

const rightIcon = computed(() => {
  return showPassword.value?View:Hide
})

const cValue = computed({
  get() {
    return props.value
  },
  set(val) {
    emit('update:value', val)
  }
})

function handleFocus(v) {
  isFocus.value = v
}
</script>

<style scoped lang='scss'>
.c-input {
  position: relative;
  width: 100%;
  .tag {
    display: block;
    padding: 0 5px;
    background: #FFFFFF;
    line-height: normal;
    left: 6px;
    top: -9px;
    z-index: 99;
    font-size: 12px;
    color: #8C8C8C;
    position: absolute;
    transition: display .5s;
  }
  .el-input{
    height: 44px;
    width: 100%;
    font-size: 14px;
    :deep(.el-input__wrapper ){
      border-radius: 4px;
      &.is-focus {}
      .el-icon {
        font-size: 18px;
      }
    }
  }
  &.active {
    .el-input {
      border-color: #262626;
      box-shadow: none;
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px #262626 inset;
      }
    }
  }
}
</style>