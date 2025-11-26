<template>
  <el-dialog
    v-model="visible"
    :title="`${formData.categoryId?'编辑':'新增'}类目`"
    :close-on-click-model="false"
    :close-on-press-escape="false"
    width="500"
    center
    @close="close"
    class="s-dialog"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="类目名称" prop="name">
        <el-input
          class="w400"
          v-model="formData.name"
          placeholder="请输入类目名称"
        />
      </el-form-item>
      <el-form-item label="类目图片" prop="pictureUrl">
        <el-upload
          accept="'.png, .jpeg, .jpg, .webp'"
          :headers="uploadSetting.headers"
          :action="uploadImgUrl"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImgUpload"
          class="img-uploader"
        >
          <img v-if="formData.pictureUrl" :src="formData.pictureUrl" class="img" />
          <el-icon v-else class="img-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="类目级别" prop="level">
        <el-select
          v-model="formData.level"
          @change="formData.parentCategoryId=''"
          placeholder="请选择类目级别"
          class="w250"
          :disabled="!!formData.categoryId"
        >
          <el-option
            v-for="item in levelOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上级类目" v-if="formData.level!==1" prop="parentCategoryId">
        <el-select
          v-model="formData.parentCategoryId"
          placeholder="请选择上级类目"
          class="w250"
          :disabled="!!formData.categoryId"
        >
          <el-option
            v-for="item in levelData"
            :key="item.categoryId"
            :label="item.name"
            :value="item.categoryId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类目权重" prop="weight">
        <el-input-number
          class="w250"
          v-model="formData.weight"
          :controls="false"
          placeholder="请输入类目权重"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close" plain>取消</el-button>
      <el-button type="primary" @click="saveForm(formRef)">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { categoryInfo, addCategory, levelCategory, updateCategory} from '@/api/commodity'
import { getToken } from "@/utils/auth";
import { computed } from 'vue';

const emits = defineEmits(['refresh'])
const {proxy} = getCurrentInstance()
const visible = ref(false)
const defaultForm = {
  name: '',
  pictureUrl: '',
  level: undefined,
  weight: undefined,
  parentCategoryId: '',
  categoryId: ''
}
const formData = reactive({...defaultForm})
const formRef = ref(null)
const rules = ref({
  name: [
    {required: true, message: '请填写类目名称', trigger: 'blur'}
  ],
  level: [
    {required: true, message: '请选择类目级别', trigger: 'change'}
  ],
  parentCategoryId: [
    {required: true, message: '请选择上级类目', trigger: 'change'}
  ],
  pictureUrl: [
    {required: true, message: '请上传类目图片', trigger: 'blur'}
  ]
})
// 上传类目图片
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})
// 层级类目数据
const firstLevel = ref([])
const secondLevel = ref([])
const levelData = computed(() => {
  const {level} = formData
  const ob = {
    1: [],
    2: firstLevel.value,
    3: secondLevel.value
  }
  return ob[level] || []
})
const levelOpt = computed(() => {
  return [
    {label: '一级', value: 1},
    {label: '二级', value: 2, disabled: !firstLevel.value.length},
    {label: '三级', value: 3, disabled: !secondLevel.value.length},
  ]
})

function close() {
  Object.assign(formData, defaultForm)
  firstLevel.value = []
  secondLevel.value = []
  formRef.value.resetFields()
  visible.value = false
}
async function saveForm(formEl) {
  if(!formEl) return
  const {categoryId} = formData
  const api = categoryId?updateCategory:addCategory
  const msgText = categoryId?'修改':'新增'
  await formEl.validate((valid) => {
    if(valid) {
      api(formData).then(res => {
        close()
        emits('refresh')
        proxy.$modal.msgSuccess(`${msgText}成功`)
      })
    }
  })
}
function handleImageSuccess(response) {
  formData.pictureUrl = response.data.url
}
function beforeImgUpload(rawFile) {
  if(rawFile.size / 1024 / 1024 > 2) {
    proxy.$modal.msgError('类目图片大小不能超过2M!')
    return false;
  }
}
async function getLevelCategory() {
  const {rows:first} = await levelCategory(1)
  const {rows:second} = await levelCategory(2)
  firstLevel.value = first
  secondLevel.value = second
}
function open(info) {
  const {categoryId} = info
  getLevelCategory()
  if(categoryId) {
    formData.categoryId = categoryId
    categoryInfo(categoryId).then(res => {
      Object.keys(formData).forEach(key => {
        formData[key] = res.data[key]
      })
    })
  }
  visible.value=true
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.w400 {
  width: 400px;
}
.w250 {
  width: 250px;
}
:deep(.el-dialog__body) {
  padding: 0%;
}
.img-uploader {
  .img {
    width: 80px;
    height: 90px;
    display: block;
  }
  :deep(.el-upload) {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: .2s;
    &:hover {
      border-color: #409eff;
    }
  }
  .el-icon.img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 90px;
    text-align: center;
  }
}
</style>