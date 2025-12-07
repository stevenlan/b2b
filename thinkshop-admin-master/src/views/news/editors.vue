<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="editorHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import { getToken } from '@/utils/auth'
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入基础样式

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef(null)
// 编辑器内容
const editorHtml = ref('')
// 工具栏配置（可根据需要简化）
const toolbarConfig = {}
// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      headers:{
        Authorization: 'Bearer ' + getToken()
      },
      server: '/stage-api/file/upload', // 你的上传接口地址
      fieldName: 'file', // 上传表单的字段名
      // 自定义插入图片
      customInsert(res, insertFn) {
        // res 为服务器返回结果
        // 从结果中获取图片 url，此处路径需根据你的接口返回结构调整
        const url = res.data.url || res.url
        if (url) {
          insertFn(url, '图片', url) // 插入图片到编辑器
        }
      },
    }
  }
}
const mode = 'default' // 或 'simple' 简洁模式

// 编辑器创建后的回调函数
// 2. 【关键】编辑器创建完成后的回调
const handleCreated = (editor) => {
  editorRef.value = editor
  // 创建后，立即用父组件传入的初始值设置编辑器内容
  if (props.modelValue) {
    editor.setHtml(props.modelValue)
  }
  // 配置编辑器内容变化时的回调，用于同步数据到父组件
  editor.on('change', () => {
    const html = editor.getHtml()
    emit('update:modelValue', html)
  })
  // 如果还需要监听失去焦点等事件，也可以在这里配置
  // editor.on('blur', () => { ... })
}

// 3. 监听父组件传入的 modelValue 变化（例如清空表单操作）
watch(() => props.modelValue, (newVal) => {
  const editor = editorRef.value
  // 如果编辑器存在，且新值与当前编辑器内的HTML不同，则更新编辑器
  if (editor && newVal !== editor.getHtml()) {
    editor.setHtml(newVal)
  }
})

// 4. 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.off('change') // 移除事件监听
  editor.destroy()
})
</script>
