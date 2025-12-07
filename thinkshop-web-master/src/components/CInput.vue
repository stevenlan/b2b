<template>
  <div :class="['c-input', cValue]">
    <span class="tag" v-show="cValue || isFocus">{{props.placeholder}}</span>
    <a-input
      v-if="props.type==='text'"
      v-model:value.trim="cValue"
      :placeholder="props.placeholder"
      :disabled="disabled"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
    >
      <template #addonAfter v-if="props.funIcon">
        <slot></slot>
      </template>
    </a-input>
    <a-date-picker
      v-if="props.type==='date'"
      v-model:value.trim="cValue"
      :placeholder="props.placeholder"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
      valueFormat="YYYY/MM/DD"
    />
    <a-input-password
      v-if="props.type==='password'"
      v-model:value.trim="cValue"
      :placeholder="props.placeholder"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
    />
  </div>
</template>

<script setup>
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
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:value'])

const isFocus = ref(false)

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
  .tag {
    display: block;
    padding: 0 5px;
    background: #FFFFFF;
    left: 6px;
    top: -9px;
    z-index: 99;
    font-size: 12px;
    color: #8C8C8C;
    position: absolute;
    transition: display .5s;
  }
  .ant-input,
  .ant-picker,
  .ant-input-password,
  :deep(.ant-input-group),
  :deep(.ant-input-group .ant-input) {
    height: 44px;
    width: 100%;
    &:hover, &:focus {
      border-color: #262626 !important;
      box-shadow: none;
    }
  }
  &.active {
    .ant-input, .ant-picker, .ant-input-password, .ant-input-group {
      border-color: #262626;
      box-shadow: none;
    }
  }
}
</style>
