<script
    setup
>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import { onBeforeUnmount, onMounted, toRefs, watch } from 'vue'
import { useWangEditor } from './utils/editor.utils'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['postMessage', 'update:modelValue'])

const { modelValue } = toRefs(props)

const {
  register,
  editorConfig,
  toolbarConfig,
  editorRef,
  value,
  handleOnCreated,
  handleOnChange,
  handleOnEditDestroy,
  handleOnFocus,
  handleOnBlur,
  handleBeforePageDestroy,
  handleMergeEditorConfig,
  handleMergeToolbarConfig,
} = useWangEditor()

register(emits)

watch(modelValue, () => {
  value.value = modelValue?.value
}, {
  immediate: true,
})

watch(value, () => {
  emits('update:modelValue', value.value)
})

defineExpose({
  handleMergeEditorConfig,
  handleMergeToolbarConfig,
})
onMounted(() => {
})
onBeforeUnmount(() => {
  handleBeforePageDestroy()
})
</script>

<template>
  <div class="wang-edit">
    <div class="wang-edit__inner">
      <Toolbar
        mode="default"
        :editor="editorRef"
        :default-config="toolbarConfig"
      />
      <Editor
        v-bind="$attrs"
        v-model="value"
        :default-config="editorConfig"
        mode="default"
        @on-created="handleOnCreated"
        @on-change="handleOnChange"
        @on-destroy="handleOnEditDestroy"
        @on-focus="handleOnFocus"
        @on-blur="handleOnBlur"
      />
    </div>
  </div>
</template>

<style
    scoped
    lang="scss"
>
.wang-edit{
  box-sizing: border-box;
  width: 100%;
  padding: 10px;

  &__inner{
    box-sizing: border-box;
    min-height: 300px;
    padding: 10px;
    background: #fff;
    border: 1px solid #dadada;
    border-radius: 10px;
  }
}
</style>
