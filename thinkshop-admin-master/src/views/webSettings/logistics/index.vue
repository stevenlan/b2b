<script setup>
import { ref } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus'
// import AddForm from "@/views/webSettings/logistics/addForm.vue";
import {delLogistics, getLogisticsList} from "@/api/logistics/index.js";
const router = useRouter()

const loading = ref(false) // 数据加载
const templateList = ref([]) // 物流模版列表

// 获取物流模版列表
function getTemplateList() {
  loading.value = true
  getLogisticsList().then(res => {
    templateList.value = res.rows
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

// 删除物流模版
function delTemplate(id) {
  ElMessageBox.confirm('是否确定删除此项？', '提示').then(() => {
    delLogistics(id).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功!',
      })
      templateList.value = []
      getTemplateList()
    }).catch((err) => {
      ElMessage({
        type: 'error',
        message: '删除失败!',
      })
    })
  }).catch(() => {
  });
}

// 新增编辑物流模版
const addFormRef = ref()
function addLogistics(id) {
  router.push({path: '/webSettings/logisticsAdd', query: {id: id}})
}
onMounted(() => {
  getTemplateList()
})
</script>

<template>
<div class="app-container" v-loading="loading">
<!--  <h3>物流方案</h3>-->
  <div class="logistics-template">
    <div class="template" v-for="(item, index) of templateList" :key="item.id">
      <div class="template-title">{{item.name}}</div>
      <div class="template-info">{{item.desc}}</div>
      <div class="template-btn">
        <el-button class="template-button" type="primary" link @click="addLogistics(item.id)">编辑</el-button>
        <el-button class="template-button" v-if="!item.isDefault" type="danger" @click="delTemplate(item.id)" link>删除</el-button>
      </div>
    </div>
    <div class="template add-template" @click="addLogistics(null)">
      <div class="icon-box"><el-icon :size="12" color="#666666" class="avatar-uploader-icon"><plus /></el-icon></div>
      <div  class="add-text">添加自定义方案</div>
    </div>
  </div>
</div>
<!--  <add-form ref="addFormRef" @rest="getTemplateList"></add-form>-->
</template>

<style scoped lang="scss">
.app-container {
  min-height: calc(100vh - 50px);
  background: #EDEFF5;
  padding: 0;
}
  .logistics-template {
    display: flex;
    flex-wrap: wrap;
    .template {
      width: 300px;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      margin:0 15px 15px 0;
      background: #ffffff;
      .icon-box {
        padding: 0 5px;
      }
      .template-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        padding: 20px 20px 0 20px;
      }
      .template-info {
        font-size: 14px;
        color: #666666;
        margin-bottom: 20px;
        height: 100px;
        padding: 0 20px;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .template-btn {
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        border-top: 1px solid #F5F5F5;
        .template-button {
          width: 50%;
          height: 100%;
          color: #8C8C8C;
        }
        .template-button:last-child{
          border-left: 1px solid #F5F5F5;
        }
        .template-button:first-child:hover{
          color: #409eff;
        }
      }
      .add-text {
        font-size: 14px;
        font-weight: 500;
        color: #666666;
      }
    }
    .add-template {
      justify-content: center;
      align-items: center;
      cursor: pointer;
      display: flex;
    }
  }
</style>
