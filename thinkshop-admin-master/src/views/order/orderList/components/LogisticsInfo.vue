<script setup>
import { ref } from "vue";
import {ElMessage} from "element-plus";

const visible = ref({
  detail: false
})

// 复制快递单号
async function copyId(id) {
  try {
    await navigator.clipboard.writeText(id);
    ElMessage({ message: '复制成功', type: 'success' })
  } catch (err) {
    ElMessage({ message: '复制失败', type: 'error' })
  }
}
const logistics = ref({})
const logisticsList = ref([])
function show (logisticsInfo, logisticsData) {
  logistics.value = logisticsInfo[0]
  logisticsList.value = logisticsData
  visible.value.detail = true
}
defineExpose({
  show
})
</script>

<template>
  <el-dialog
      v-model="visible.detail"
      :close-on-click-modal="false"
      title="物流详情"
      width="35%"
  >
    <div class="app-container timeline">
      <div class="timeline-box">
        <div class="express-delivery">
          <div class="corporation"><span>快递公司：</span>{{logistics.deliveryName}}</div>
          <div class="corporation oddNumber">
            <span>快递单号：{{logistics.deliveryId ? logistics.deliveryId : logistics.deliverySn}}</span>
            <el-button type="primary" link @click="copyId(logistics.deliveryId)"><el-icon color="#8C8C8C"><CopyDocument /></el-icon></el-button>
          </div>
        </div>
        <el-timeline style="max-width: 600px">
          <el-timeline-item v-for="item of logisticsList" :key="item.key_stage">
            <h4>{{item.key_stage}}</h4>
            <p>{{item.time_iso}}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.timeline {
  background: #F5F6FA;
  border-radius: 4px;
  padding: 16px;
  .timeline-box {
    background: #FFFFFF;
    padding: 24px 24px 0 24px;
    border-radius: 4px;
  }
  h4 {
    margin-top: 0;
  }
  h5 {
    font-size: 14px;
    color: #666666;
    margin: 10px 0;
  }
   p {
     color: #999999;
     font-size: 12px;
   }
  .express-delivery {
    margin-bottom: 20px;
    padding-bottom: 20px;
    display: flex;
    border-bottom: 1px solid #E5E5E5;
    span {
      color: #8C8C8C;
      font-weight: 400;
    }
    .corporation {
      margin-right: 24px;
    }
    h3 {
      margin-bottom: 15px;
    }
    .corporation {
      font-weight: 500;
    }
    .oddNumber {
      display: flex;
      align-items: center;
    }
  }
}
</style>
