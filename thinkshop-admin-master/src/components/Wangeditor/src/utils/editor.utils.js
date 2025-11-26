// import { ref, shallowRef, unref } from 'vue'
import { uploadFileApi } from "@/api/commodity";
import { ElMessage,ElLoadingService } from "element-plus";

export const emitNames = ['postMessage']

/**
 * customPaste:自定义粘贴。可阻止编辑器的默认粘贴，实现自己的粘贴逻辑。
 * customAlert:自定义编辑器 alert 。如想用 antd 的 message 功能。
 * editorConfig.MENU_CONF:菜单栏相关配置
 */
export function useWangEditor() {
  let emits
  const value = ref('')
  function register(emitsObj) {
    emits = emitsObj
  }

  // 编辑器实例，必须用 shallowRef，重要！
  const editorRef = shallowRef()

  /**
     * 编辑器创建完毕时的回调函数
     * 此时需要给全局的editorRef赋值供toolbar使用
     * @param editor
     */
  function handleOnCreated(editor) {
    editorRef.value = editor
    postMessage('onCreated', editor, { value: value.value })
  }

  /**
     * 编辑器内容、选区变化时的回调函数
     * @param editor
     */
  function handleOnChange(editor) {
    postMessage('onChange', editor, { content: editor.children, value: value.value })
  }

  /**
     * 编辑器销毁回调
     * @param editor
     */
  function handleOnEditDestroy(editor) {
    postMessage('onDestroy', editor, { value: value.value })
  }

  /**
     * 当组件销毁的时候必须调用此函数！
     * onBeforeUnmount
     */
  function handleBeforePageDestroy() {
    const editor = editorRef.value
    if (editor === null)
      return
    editor?.destroy()
  }

  /**
     * 编辑器聚焦
     * @param editor
     */
  function handleOnFocus(editor) {
    postMessage('onFocus', editor, { value: value.value })
  }

  /**
     * 编辑器失焦
     * @param editor
     */
  function handleOnBlur(editor) {
    postMessage('onBlur', editor, { value: value.value })
  }

  /**
   * 通知父组件
   * @param funcName 被调用方法名称
   * @param editor 编辑器实例
   * @param data 传递的参数
   */
  function postMessage(funcName, editor, data) {
    emits && emits('postMessage', { name: funcName, editor, value: value.value, data })
  }

  // 编辑器的默认配置
  const editorConfig= ref({
    placeholder: '请输入内容...', // 占位内容
    readOnly: false, // 是否只读
    autoFocus: true, // 是否自动聚焦
    scroll: true, // 配置编辑器是否支持滚动，默认为 true 。注意，此时不要固定 editor-container 的高度，设置一个 min-height 即可
    maxLength: 2000, // 最大长度，超过这个长度会调用onMaxLength事件
    MENU_CONF: {
      uploadImage: {
        // 自定义上传
        customUpload: handleCustomUpload,
      },
      uploadVideo: {
        // 自定义上传
        customUpload:handleCustomUpload,
      },
    },
  })

  // 工具栏默认配置
  const toolbarConfig= ref({
    excludeKeys: ['fullScreen'],
  })

  function handleMergeEditorConfig(config) {
    editorConfig.value = { ...unref(editorConfig), ...config }
  }

  function handleMergeToolbarConfig(config) {
    editorConfig.value = { ...unref(editorConfig), ...config }
  }

  return {
    register,
    editorRef,
    value,
    editorConfig,
    toolbarConfig,
    handleOnCreated,
    handleOnChange,
    handleBeforePageDestroy,
    handleOnEditDestroy,
    handleOnFocus,
    handleOnBlur,
    handleMergeEditorConfig,
    handleMergeToolbarConfig,
  }
}

/**
 * 触发上传图片以后
 * 自己上传完成以后需要调用insertFn()插入
 * @param file
 * @param insertFn
 */
function handleCustomUpload(file, insertFn) {
  const loadingInstance = ElLoadingService({
    lock: true,
    text: '上传中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const formData = new FormData();
  formData.append('file',file)
  uploadFileApi(formData).then(res=>{
    const url = res.data.url
    insertFn(url,url,url)
    ElMessage.success('上传成功')
  }).catch((e)=>{
    ElMessage.error('上传失败')
    console.error(e)
  }).finally(()=>{
    loadingInstance.close()
  })
}
