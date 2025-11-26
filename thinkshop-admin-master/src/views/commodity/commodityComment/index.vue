<template>
  <div class="p24">
    <div class="mb16">
      <el-button
        type="danger"
        plain
        @click="handleDelete()"
      >批量删除</el-button>
      <el-button
        type="primary"
        icon="Plus"
        @click="addComment"
      >新增自评</el-button>
    </div>
    <el-table  v-loading="loading" :data="tableObj.rows" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="商品信息" width="200">
        <template #default="scope">
          <div class="img-colum">
            <img :src="scope.row.productImage"/>
            <div class="pro-info">
              <p>{{scope.row.productName}}</p>
              <p>{{scope.row.productSku}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="commentUser"/>
      <el-table-column label="评分">
        <template #default="scope">
          <el-rate v-model="scope.row.score" :disabled="true" :allow-half="true"/>
        </template>
      </el-table-column>
      <el-table-column label="评价内容">
        <template #default="scope">
          <div>
            <p :class="['con-text', scope.row.showMore?'more':'']" @click="scope.row.showMore=!scope.row.showMore">{{scope.row.comment}}</p>
            <el-space :wrap="true">
              <el-image
                v-for="(it, i) in scope.row.imageUrlSet"
                :key="i"
                style="width: 40px; height: 40px"
                :src="it"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[it]"
                :initial-index="1"
                fit="contain"
                :z-index="9999"
              />
            </el-space>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="隐藏"
            @change="e => {changeStatus(e,  scope.row.id)}"
          />
        </template>
      </el-table-column>
      <el-table-column label="评价时间" prop="commentTime"/>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
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
import {queryComment, updateComment, delComment} from '@/api/commodity'

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
  const {rows=[], total=0} = await queryComment(query.value)
  tableObj.value = {rows, total}
  loading.value = false
}
// 修改评论状态
function changeStatus(status, id) {
  updateComment(id, status).then(res => {
    getList()
  })
}
// 删除、批量删除标签
function handleDelete(row) {
  const ids = row?row.id:selectedRows.value.join(',')
  if(!ids) return proxy.$modal.msgWarning('请选择要删除的评论')
  proxy.$modal.confirm('确定要删除该评论吗？', '删除提示')
  .then(() => {return delComment({ids})})
  .then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  })
}
function addComment() {
  addRef.value.open()
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