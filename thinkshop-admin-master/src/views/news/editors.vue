<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <!-- 编辑器：直接使用 v-model 绑定传入的 modelValue -->
    <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="editorHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import { getToken } from '@/utils/auth'
import { ref, shallowRef, watch, onBeforeUnmount } from 'vue' // 引入 watch
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// 编辑器实例，必须用 shallowRef[citation:6]
const editorRef = shallowRef(null)
// 编辑器内容：直接作为响应式变量，关联到 v-model
const editorHtml = ref(props.modelValue)

// 工具栏配置
const toolbarConfig = {}
// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      server: '/stage-api/file/upload',
      fieldName: 'file',
      // 自定义插入图片
      customInsert(res, insertFn) {
        const url = res.data?.url || res.url
        if (url) {
          insertFn(url, '图片', url)
        }
      },
    }
  }
}
const mode = 'default'

// 编辑器创建后的回调函数
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！[citation:6]
  // 初始内容已通过 v-model 和下面的 watch 设置，此处无需再调用 editor.setHtml
}

// 编辑器内容变化时的回调函数[citation:6]
const handleChange = (editor) => {
  const html = editor.getHtml()
  // 同步到父组件
  emit('update:modelValue', html)
}

// 监听父组件传入的 modelValue 变化，并更新编辑器内容
watch(() => props.modelValue, (newVal) => {
  const editor = editorRef.value
  // 防止循环更新
  if (editor && newVal !== editor.getHtml()) {
    editorHtml.value = newVal // 更新 v-model 绑定的数据，驱动编辑器视图更新
  }
})

// 组件销毁时，及时销毁编辑器[citation:6]
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
