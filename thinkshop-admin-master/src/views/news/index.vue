<template>
  <div class="p24">
    <div class="mb16">
<!--      <el-button-->
<!--        type="danger"-->
<!--        plain-->
<!--        @click="handleDelete()"-->
<!--      >批量删除</el-button>-->
      <el-button
        type="primary"
        icon="Plus"
        @click="addComment('add')"
      >新增</el-button>
    </div>
    <el-table  v-loading="loading" :data="tableObj.rows">
<!--      <el-table-column type="selection" width="50" align="center" />-->
      <el-table-column label="id" prop="id" width="100"/>
      <el-table-column label="标题" prop="title"/>
      <el-table-column label="简介" prop="mainPoint"/>
<!--      <el-table-column label="状态">-->
<!--        <template #default="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.status"-->
<!--            inline-prompt-->
<!--            :active-value="1"-->
<!--            :inactive-value="0"-->
<!--            active-text="显示"-->
<!--            inactive-text="隐藏"-->
<!--            @change="e => {changeStatus(e,  scope.row.id)}"-->
<!--          />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="时间" prop="updateTime"/>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="addComment('edit',scope.row)">修改</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableObj.total>0"
      :total="tableObj.total"
      v-model:page="query.pageNum"
      v-model:limit="query.pageSize"
      @pagination="getList"
    />
    <add ref="addRef" @reload="reload"/>
  </div>
</template>

<script setup>

import Add from  './add.vue'
import {listNews, updateNews, delNews} from '@/api/system/news'

const {proxy} = getCurrentInstance()

const addRef = ref(null)
const loading = ref(false)
const selectedRows = ref([])
const tableObj = ref({
  total: 0,
  rows: []
})
const query = ref({
  pageNum: 1,
  pageSize: 10
})

function reload() {
  query.value.pageNum = 1
  getList()
}
async function getList() {
  loading.value = true
  const {rows=[], total=0} = await listNews(query.value)
  tableObj.value = {rows, total}
  loading.value = false
}
// 修改评论状态
function changeStatus(status, id) {
  updateNews(id, status).then(res => {
    getList()
  })
}
// 删除、批量删除标签
function handleDelete(row) {
  const ids = row?row.id:selectedRows.value.join(',')
  if(!ids) return proxy.$modal.msgWarning('请选择要删除的新闻')
  proxy.$modal.confirm('确定要删除该新闻吗？', '删除提示')
  .then(() => {return delNews(ids)})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  })
}
function addComment(type,row) {
  addRef.value.open(type,row?.id)
}
function handleSelectionChange(rows) {
  selectedRows.value = rows.map(it => it.id)
}

getList()
</script>

<style scoped lang="scss">
.img-colum  {
  display: flex;
  align-items: start;
  column-gap: 8px;
  img {
    width: 40px;
    height: 40px;
  }
  .pro-info {
    p{
      font-size: 12px;
    }
  }
}
.con-text {
  color: #939599;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制在一个块元素显示的文本的行数 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  overflow: hidden;
  text-overflow: ellipsis;
  &.more {
    display: block;
  }
}
:deep(.el-table__cell) {
  position: static !important; // 解决el-image 和 el-table冲突层级冲突问题
}
</style>
