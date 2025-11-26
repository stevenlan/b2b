<template>
  <div>
    <el-table
      :data="tableObj.rows"
      v-loading="loading"
    >
      <el-table-column prop="id" label="消息ID" width="120"/>
      <el-table-column prop="sceneName" label="通知场景"/>
      <el-table-column prop="" label="站内信" width="150" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.useInform"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
            @change="handleChange(scope.row)"
            v-if="scope.$index>1"
          />
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="邮件通知" width="150" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.useEmail"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
            @change="handleChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="120" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="handleMsg(scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {querySysMessage, updateSysMessage} from '@/api/websiteSet'

const router = useRouter()
const loading = ref(false)
const tableObj = ref({
  rows: [],
  total: 0
})

function handleChange(row) {
  updateSysMessage(row).then(r => {
    init()
  })
}
function init() {
  loading.value = true
  querySysMessage().then(r => {
    loading.value = false
    tableObj.value = {
      rows: r.rows,
      total: r.total
    }
  })
}
function handleMsg(row={}) {
  router.push({
    path: '/webSettings/handleNotice',
    query: {
      type: 'msg',
      id: row.id||''
    }
  })
}

init()
</script>