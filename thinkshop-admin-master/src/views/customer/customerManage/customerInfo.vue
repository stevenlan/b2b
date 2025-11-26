<template>
  <el-dialog
    title="客户详情"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="50%"
    @close="close"
  >
    <div class="p-box basic">
      <p class="t-text">基本信息</p>
      <p>客户邮箱：{{ info.email }}</p>
      <p>注册时间：{{ parseTime(info.createTime) }}</p>
      <p>NAME：{{ info.firstName||'' }}{{ info.lastName||'' }}</p>
      <p>客户标签：{{ info.tagName }}</p>
    </div>
    <div class="p-box">
      <p class="t-text">交易信息</p>
      <ul>
        <li
          v-for="it in dealList"
          :key="it.field"
        >
          <p>{{it.label}}</p>
          <p>{{it.value}}</p>
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<script setup>
import {queryUserInfo} from '@/api/customer'

const {proxy} = getCurrentInstance()

const visible = ref(false)
const info = ref({})
const dealList = reactive([
  {label: '累计消费金额（元）', value: '0.00', field: 'totalOrderAmount'},
  {label: '累计消费订单数', value: '0', field: 'orderCount'},
  {label: '最近下单时间', value: '-', field: 'lastConsumeTime'},
  {label: '累计退款金额', value: '0.00', field: 'totalRefundAmount'},
  {label: '累计退款订单数', value: '0', field: 'refundCount'},
])

function open(row) {
  visible.value = true
  queryUserInfo(row.id).then(r => {
    const {data} = r
    const {tagList} = data
    data.tagName = tagList?.length?tagList.map(it=>it.tagName).join(','):''
    dealList.forEach(it => {
      let val = info[it.field] || 0
      if(it.field==='lastConsumeTime') val = proxy.parseTime(val)
      it.value = val
    })
    info.value = r.data
  })
}
function close() {
  info.value = {}
  visible.value = false
}

defineExpose({open})
</script>

<style lang="scss" scoped>
.p-box {
  margin-bottom: 30px;
  &.basic {
    p {
      padding-left: 20px;
      margin-bottom: 10px;
      &.t-text {
        padding: 0;
      }
    }
  }
  .t-text {
    font-size: 20px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    li {
      flex: 1;
      p {
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
