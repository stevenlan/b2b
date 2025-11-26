<template>
  <el-dialog
    width="400"
    v-model="visible"
    title="添加标签"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    center
    class="s-dialog"
  >
    <el-form
      :model="formData"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="标签" prop="tagIds">
        <el-select
          placeholder="请选择标签"
          v-model="formData.tagIds"
          multiple
        >
          <el-option v-for="it in props.tagList" :value="it.id" :label="it.name"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="saveLabel(formRef)">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {addUserTag} from '@/api/customer'
const props = defineProps({
  tagList: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['refresh'])
const visible = ref(false)
const formData = ref({
  tagIds: []
})
const formRef = ref(null)
const rules = reactive({
  tagIds: [
    {required: true, message: '请选择标签', trigger: 'change'}
  ]
})

function open(row) {
  const {id,  tagList: list} = row
  visible.value = true
  formData.value = {
    id,
    tagIds: list&&list.length?list.map(it => it.tagId):[]
  }
}
function close() {
  formData.value = {tagIds: []}
  formRef.value.resetFields()
  visible.value = false
}
async function saveLabel(formEl) {
  if(!formEl) return
  await formEl.validate(async(valid) => {
    if(valid) {
      addUserTag(formData.value).then(r => {
        close()
        emits('refresh')
      })
    }
  })
}

defineExpose({open})
</script>