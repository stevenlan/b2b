<template>
  <div class="p24">
    <el-row :gutter="10" class="mb16">
      <el-col :span="1.5">
        <el-button
            type="primary"
            icon="Plus"
            @click="()=> {handleTag()}"
        >添加标签</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            @click="handleDelete()"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="queryParams" ref="queryRef" class="search-form">
      <el-form-item label="标签名称" prop="name">
        <el-input placeholder="请输入标签名称" v-model="queryParams.name"/>
      </el-form-item>
      <el-form-item label="客户数量">
        <el-input-number :controls="false" class="w60" :precision="0" :max="queryParams.userCountMax || Infinity" v-model="queryParams.userCountMin"/>
        <span class="mlr5">至</span>
        <el-input-number :controls="false" class="w60" :precision="0" :min="queryParams.userCountMin" v-model="queryParams.userCountMax"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table  v-loading="loading" :data="tableOb.rows" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="100" align="center" label="序号"/>
      <el-table-column align="center" label="标签名称" prop="name" key=""/>
      <el-table-column align="center" label="备注信息" prop="remark" key=""/>
      <el-table-column align="center" label="客户数量" prop="userCount" key=""/>
      <el-table-column align="center" label="操作" prop="" key="" width="280">
        <template #default="scope">
          <el-button type="primary" link @click="handleTag(scope.row)">编辑</el-button>
          <el-button type="danger" link  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="tableOb.total"
      v-show="tableOb.total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 新增编辑标签对话框 -->
    <el-dialog
      :title="label.title"
      v-model="label.open"
      width="400px"
      append-to-body
      class="s-dialog"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称"/>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" placeholder="请输入备注信息" v-model="form.remark"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveLabel(formRef)">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {queryTag, addTag, updateTag, delTag} from '@/api/customer'
const { proxy } = getCurrentInstance();

const defaultQuery = {
  name: '',
  userCountMin: null,
  userCountMax: null,
  pageNum: 1,
  pageSize: 10
}
const queryParams = ref({...defaultQuery})
const queryRef = ref(null)
const tableOb = ref({
  total: 0,
  rows: []
})
const loading = ref(false)
const label = ref({
  open: false,
  title: ''
})
const form=  ref({
  name: '',
  remark: ''
})
const formRef = ref(null)
const rules = ref({
  name: [
    {required: true, message: '请输入标签名称', trigger: 'blur'}
  ]
})
// 已选标签
const selectedTags = ref([])

function getList() {
  loading.value = true
  queryTag(queryParams.value).then(r => {
    loading.value = false
    tableOb.value = {
      total: r.total,
      rows: r.rows
    }
  })
}
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
function resetQuery() {
  queryParams.value = {...defaultQuery}
  getList()
}
// 新增、编辑标签
function handleTag(row) {
  Object.assign(label.value, {
    open: true,
    title: `${row?'编辑':'新增'}标签`
  })
  if(row) form.value = {...row}
}
// 删除、批量删除标签
function handleDelete(row) {
  const ids = row?row.id:selectedTags.value.join(',')
  if(!ids) return proxy.$modal.msgWarning('请选择要删除的标签')
  proxy.$modal.confirm('确定要删除该标签吗？', '删除提示')
  .then(() => {return delTag({ids})})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  })
}
function handleSelectionChange(rows) {
  selectedTags.value = rows.map(it => it.id)
}
// 新增保存抱歉
async function saveLabel(formEl) {
  await formEl.validate(async(valid) => {
    if(valid) {
      const api = form.value.id?updateTag:addTag
      const msg = form.value.id?'编辑':'新增'
      api(form.value).then(r => {
        cancel()
        getList()
        proxy.$modal.msgSuccess(`${msg}成功`)
      })
    }
  })
}
function cancel() {
  label.value.open = false
  proxy.resetForm("formRef")
  form.value = {
    name: '',
    remark: ''
  }
}

getList()
</script>

<style lang="scss" scoped>
.w60 {
  width: 100px;
}
.mlr5 {
  margin: 0 5px;
  color: #666666;
}
</style>