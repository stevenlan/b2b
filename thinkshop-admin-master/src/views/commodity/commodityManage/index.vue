<template>
  <div class="p24">
    <div class="mb16">
      <el-button type="primary" :icon="Plus" @click="()=>{addCommodity()}">新增商品</el-button>
      <el-button type="primary" @click="handleImport">商品导入</el-button>
      <el-button type="primary" @click="handleExport">商品导出</el-button>
    </div>
    <!-- 搜索 -->
    <el-form
      :inline="true"
      :model="query"
      label-width="68px"
      ref="queryRef"
      class="search-form"
    >
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="上架状态" prop="isShow">
        <el-select
          v-model="query.isShow"
          placeholder="请选择上架状态"
        >
          <el-option label="已上架" :value="1" />
          <el-option label="已下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品id" prop="productCode">
        <el-input
          v-model="query.productCode"
          maxlength="20"
          placeholder="请输入商品id"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="query.productName"
          maxlength="20"
          placeholder="请输入商品名称"
        />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableOb.rows"
      v-loading="loading"
    >
      <el-table-column
        prop="productCode"
        label="商品id"
        show-overflow-tooltip
      />
      <el-table-column label="商品图片" width="150" align="center">
        <template #default="scope">
          <img
            height="40"
            width="40"
            :src="formatImg(scope.row.image)"
            alt
            srcset
          />
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="220" />
      <el-table-column
        prop="section"
        label="售价区间"
        show-overflow-tooltip
        width="140"
      >
        <template #default="scope">
          {{`${scope.row.skuType===1?'':scope.row.minPrice+'~'}${scope.row.maxPrice}`}}
        </template>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        show-overflow-tooltip
      />
      <el-table-column prop="sales" label="销量" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="220">
        <template #default="scope">
          {{parseTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="状态" show-overflow-tooltip width="100">
        <template #default="scope">
          <span v-if="scope.row.isShow == 0">未上架</span>
          <span v-if="scope.row.isShow == 1">已上架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleTableItem(scope.row, 'info')">详情</el-button>
          <el-button type="primary" link @click="handleTableItem(scope.row, 'edit')">编辑</el-button>
          <el-button
            v-if="scope.row.isShow == 0"
            type="primary"
            link
            @click="handleTableItem(scope.row, 'up')"
          >上架</el-button>
          <el-button
            v-if="scope.row.isShow == 1"
            type="primary"
            link
            @click="handleTableItem(scope.row, 'down')"
          >下架</el-button>
          <el-button type="danger" link @click="handleTableItem(scope.row, 'del')">删除</el-button>
          <!-- <el-popconfirm
            title="确认删除？"
            @confirm="handleTableItem(scope.row, 'del')"
          >
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="tableOb.total>0"
      :total="tableOb.total"
      v-model:page="query.pageNum"
      v-model:limit="query.pageSize"
      @pagination="getList"
    />
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body class="s-dialog">
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
            <div class="el-upload__tip text-center">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
            </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth"
import {queryProduct, delProduct, displayProduct} from '@/api/commodity'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const { proxy } = getCurrentInstance();

const queryRef = ref(null)
const query = reactive(
  {
    productName: "",
    productCode: "",
    isShow: "",
    pageNum: 1,
    pageSize: 10
  }
)
const dateRange = ref([])
const loading = ref(false);
const tableOb = reactive({
  total: 0,
  rows: []
})
/*** 商品导入参数 */
const upload = reactive({
  // 是否显示弹出层（商品导入）
  open: false,
  // 弹出层标题（商品导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/mall/admin/product/importProduct"
})

/** 导入按钮操作 */
function handleImport() {
  upload.title = "商品导入";
  upload.open = true;
}
const search = () => {
  query.pageNum = 1
  getList()
}
function getList() {
  loading.value = true
  queryProduct({
    ...query,
    startTime: dateRange.value[0],
    endTime: dateRange.value[1]
  }).then(res => {
    const {total, rows} = res
    loading.value = false
    Object.assign(tableOb, {
      total,
      rows
    })
  })
}
// 格式商品图片
function formatImg(imgs) {
  if(!imgs) return ''
  return imgs.split(',')[0]
}
function reset() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  search()
}
function addCommodity(info={}) {
  router.push({path: '/commodity/handle'})
}
const handleTableItem = (row, type) => {
  // 详情
  if(type==='info') {
    router.push({path: '/commodity/detail', query: {productId: row.productId}})
  }
  if(type==='edit') {
    router.push({path: '/commodity/handle', query: {id: row.productId}})
  }
  if(type==='del') {
    proxy.$modal.confirm('确认要删除该商品吗?').then(function () {
      return delProduct({productIds: row.productId})
    }).then(() => {
      proxy.$modal.msgSuccess("删除成功")
      getList()
    }).catch(function () {

    })
  }
  if(type==='up') {
    if(!row.stock) {
      proxy.$modal.msgWarning('库存为0，不可上架')
      return
    }
    displayProduct({productId: row.productId, type: 1}).then(() => {
      proxy.$modal.msgSuccess("上架成功")
      getList()
    })
  }
  if(type==='down') {
    proxy.$modal.confirm('确认下架该商品吗?').then(function () {
      return displayProduct({productId: row.productId, type: 0})
    }).then(() => {
      proxy.$modal.msgSuccess("下架成功")
      getList()
    }).catch(function () {

    })
  }
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download("/mall/admin/product/importTemplate", {
  }, `product_template_${new Date().getTime()}.xlsx`)
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
}
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getList();
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("/mall/admin/product/exportProduct", {
    ...query,
    startTime: dateRange.value[0],
    endTime: dateRange.value[1]
  },`product_${new Date().getTime()}.xlsx`);
}

getList()
</script>

<style lang="scss" scoped>
.page-manage {
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
}
</style>
