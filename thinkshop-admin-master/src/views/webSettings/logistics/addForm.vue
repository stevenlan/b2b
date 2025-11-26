<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import {ElMessage, ElTree} from 'element-plus'
import {getSelectProduct, getRegionList, addLogistics, upLogistics, getLogistics} from "@/api/logistics/index.js";
import {formatDate} from "@/utils/index.js";
import countryRegionData from '@/assets/data/area.json'; // 国家地区
const route = useRoute()
const router = useRouter();
const resourceCheckedKey = ref([])
const title = ref('添加物流模版')
function init () {
  const {id} = route.query
  if(id) {
    form.id = id
    treeRef.value?.setCheckedKeys([])
    loading.value = true
    getLogistics(id).then(res => {
      let { productList, ...rest } = res.data
      form.value = rest
      enableFree.value = res.data.enableFree ? 1 : 2
      resourceCheckedKey.value = form.value.regionIds
      selectGoods.value = productList
      loading.value = false
    })
  }
}

const loading = ref(false)
const loadingBtn = ref(false)

const logisticsFormRef = ref();
const form = ref({
  chargingType: 1,
  productIds: [],
  regionIds: [],
  id: null
});

// 按件数数据
const perUnitTable = ref([
  {
    numberOfFirstPieces: 0, // 首件数
    freight: 0, // 运费
    continuations: 0, // 续件数
    renew: 0, // 续费
    firstMultiplicity: 0, // 首重数
    repeatedMultiplicity: 0 // 续重数
  }
])

// 选择商品数据
const selectGoods = ref([])

// 是否免运费
const enableFree = ref(1)

// 删除产品
function delProduct (row) {
  let curIndex = 0
  form.value.productIds.forEach((item, index) => {
    if (item === row.productId) {
      curIndex = index
    }
  })
  form.value.productIds.splice(curIndex, 1)
  selectGoods.value.splice(curIndex, 1)
}

// 选择商品搜索
const total = ref(0)
const groupData = ref([])
const multipleTableRef = ref()
const multipleSelection = ref([])
const productQuery = ref({
  productName: '',
  pageNum: 1,
  pageSize: 10,
})
const productVisible = ref(false) // 弹出选择商品

// 选择商品显示
function chooseProduct () {
  getProductList()
  productVisible.value = true
}
// 取消选择商品
function closeSelect () {
  productVisible.value = false
}
// 选中商品
function handleSelectionChange (val) {
  multipleSelection.value = val
}
// 保存选择商品ID
function saveIdList () {
  const idList = []
  selectGoods.value = multipleSelection.value
  multipleSelection.value.forEach((i) => {
    idList.push(i.productId)
  })
  form.value.productIds = idList
  multipleTableRef.value.clearSelection()
  productVisible.value = false
  vildateForm('productIds')
}

// 获取可选择商品列表
function getProductList() {
  loading.value = true
  getSelectProduct(
      productQuery.value
  ).then((res) => {
    if (res.code === 200) {
      groupData.value = res.rows
      total.value = res.total
      loading.value = false
      for (let i = 0; i < groupData.value.length; i++) {
        for (let j = 0; j < selectGoods.value.length; j++) {
          if (groupData.value[i].productId === selectGoods.value[j].productId) {
            multipleTableRef.value.toggleRowSelection(groupData.value[i])
          }
        }
      }
    }
  })
}
// 切换分页
function handleCurrentChange (val) {
  productQuery.value.pageNum = val
  getProductList()
}

function handleSizeChange (val) {
  productQuery.value.pageSize = val
  getProductList()
}
// 重置选择商品弹窗搜索
function clear() {

}
function vildateForm (str) {
  if (str) {
    logisticsFormRef.value.validateField(str)
  }
}

// 选择地区
const districtVisible = ref(false)
const districtFilterText = ref('')
const treeRef = ref()
const currentSelectDistrict = ref([])

const defaultProps = {
  children: 'regions',
  label: 'name'
}

watch(districtFilterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}
console.log(countryRegionData)
const districtData = countryRegionData
// 显示配送区域弹窗
function showArea() {
  // getCountryRegion()
  districtVisible.value = true
}
// 地区节点选择
function handleCheckChange(checkedNodes, checkedKeys) {
  currentSelectDistrict.value = checkedKeys.checkedKeys
  console.log(currentSelectDistrict.value, 'sdfsd')
}
// 保存勾选的国家地区
function saveDistrictIdList() {
  form.value.regionIds = currentSelectDistrict.value
  districtVisible.value = false
}
// 取消选择国家地区
function closeSelectDistrict() {
  districtVisible.value = false
}
// 保存提交
function submit() {
  logisticsFormRef.value.validate((valid) => {
    if (valid) {
      loadingBtn.value = true
      if (form.id) {
        form.value.enableFree = enableFree.value === 1 ? true : false
        upLogistics(form.value).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功!',
          })
          cancel()
          loadingBtn.value = false
        }).catch((err) => {
          console.log(err, 'err')
          ElMessage({
            type: 'error',
            message: '修改失败!',
          })
          loadingBtn.value = false
        })
      } else {
        addLogistics(form.value).then(() => {
          ElMessage({
            type: 'success',
            message: '新增成功!',
          })
          cancel()
          loadingBtn.value = false
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: '新增失败!',
          })
          loadingBtn.value = false
        })
      }
    }
  })
}

// 取消添加
function cancel () {
  router.push({path: '/webSettings/logistics'})
}
init()
</script>

<template>
  <div class="logiistics-add" v-loading="loading">
    <h3>添加物流方案</h3>
    <el-form
        ref="logisticsFormRef"
        :model="form"
        label-width="80px"
    >
      <el-form-item label="方案名称" prop="name" required>
        <el-input type="text" style="width: 500px" v-model="form.name" maxlength="50"/>
      </el-form-item>
      <el-form-item label="方案介绍" prop="desc">
        <el-input type="textarea" style="width: 500px" v-model="form.desc" maxlength="200"
        />
      </el-form-item>
      <el-form-item label="计费方式" prop="chargingType" required>
        <el-radio-group v-model="form.chargingType">
          <el-radio :label="1">按件数</el-radio>
          <el-radio :label="2">按重量</el-radio>
          <el-radio :label="3">固定运费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-table :data="perUnitTable" style="width: 60%; margin-bottom: 20px" border v-if="form.chargingType === 1">
          <el-table-column align="center" label="首件数（件）">
            <template #default="scope">
              <el-input-number v-model="form.firstPiece" :controls="false" :max="999999999" :min="0" :precision="0" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="运费">
            <template #default="scope">
              <el-input-number v-model="form.firstPrice" :controls="false" :max="999999999" :min="0" :precision="2" :step="0.01" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="续件数（件）">
            <template #default="scope">
              <el-input-number v-model="form.otherPiece" :controls="false" :max="999999999" :min="0" :precision="0" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="续费">
            <template #default="scope">
              <el-input-number v-model="form.otherPrice" :controls="false" :max="999999999" :min="0" :precision="2" :step="0.01" />
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="perUnitTable" style="width: 60%; margin-bottom: 20px" border v-if="form.chargingType === 2">
          <el-table-column align="center" label="首重数（kg）">
            <template #default="scope">
              <el-input-number v-model="form.firstPiece" :controls="false" :max="999999999" :min="0" precision="2" :step="0.01" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="运费">
            <template #default="scope">
              <el-input-number v-model="form.firstPrice" :controls="false" :max="999999999" :min="0" :precision="2" :step="0.01" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="续重数（kg）">
            <template #default="scope">
              <el-input-number v-model="form.otherPiece" :controls="false" :max="999999999" :min="0" precision="2" :step="0.01" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="续费">
            <template #default="scope">
              <el-input-number v-model="form.otherPrice" :controls="false" :max="999999999" :min="0" :precision="2" :step="0.01" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="" label-width="270px" prop="fixedFreight" v-if="form.chargingType === 3">
        <el-input-number :controls="false" :max="999999999" :min="0" :precision="2" :step="0.01" style="width: 150px;" v-model="form.fixedPrice" />
      </el-form-item>
      <el-form-item label="配送区域" required>
        <div class="selectionr-region">
          <el-button type="primary" @click="showArea">请选择</el-button>
          <div class="selected-text">已选择{{form.regionIds.length}}个区域</div>
        </div>
      </el-form-item>
      <el-form-item label="免运费" prop="enableFree" class="enableFree">
        <el-radio-group v-model="enableFree">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <p class="enable-free-text">开启后，满足以下条件时，不收取运费。</p>
      <el-form-item label="">
        <div class="orderAmount-box">
          <el-form-item label="订单金额大于" prop="ordrAmounterAmount" label-width="120px" style="margin-bottom: 10px">
            <el-input-number v-model="form.orderAmount" placeholder="请输入" :controls="false" :max="999999999" :min="0" :precision="2" :step="0.01" :disabled="enableFree===2"/>
          </el-form-item>
          <el-form-item label="订单数量大于" prop="orderItemCount" label-width="120px">
            <el-input-number v-model="form.orderItemCount" placeholder="请输入" :controls="false" :max="999999999" :min="0" :precision="0" :step="1" :disabled="enableFree===2"/>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item class="applyType" label="适用商品" prop="applicableGoods" v-if="!form.isDefault">
        <div class="applicable-goods">
          <el-button type="primary" @click="chooseProduct">请选择<i v-if="form.productIds.length !== 0" class="selectNum">{{ form.productIds.length }}</i></el-button>
          <div class="selecTable">
            <el-table
                :data="selectGoods"
                border
                :header-cell-style="{
                background: '#EEF3FF',
                color: '#333333'
              }"
                tooltip-effect="dark"
                style="width: 100%; margin-top: 15px"
            >
              <el-table-column
                  prop="productId"
                  label="商品id"
                  width="100"
                  align="center"
              />
              <el-table-column label="商品主图" width="150" align="center">
                <template #default="scope">
                  <el-image :src="scope.row.image" style="width:80px;height:80px" />
                </template>
              </el-table-column>
              <el-table-column
                  prop="productName"
                  label="商品名称"
              />
              <el-table-column
                  prop="priceRange"
                  label="售价区间"
                  width="200"
              >
                <template #default="scope">
                  {{`${scope.row.skuType===1?'':scope.row.minPrice+'~'}${scope.row.maxPrice}`}}
                </template>
              </el-table-column>
              <el-table-column
                  prop="stock"
                  label="库存"
                  width="80"
              />
              <el-table-column
                  prop="sales"
                  label="销量"
                  width="80"
              />
              <el-table-column prop="createTime" label="创建时间" width="220">
                <template #default="scope">
                  <span>{{formatDate(scope.row.createTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <div class="btnList">
                    <el-popconfirm
                        title="确定删除此商品？"
                        @confirm="delProduct(scope.row)"
                    >
                      <template #reference>
                        <el-button
                            class="delCls"
                            link
                            type="danger"
                        >删除</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 选择商品弹窗 -->
    <el-dialog
        v-model="productVisible"
        title="选择商品"
        width="55%"
        top="50px"
        class="group-dialog"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :modal="false"
    >
      <div class="formSearch">
        <el-form :inline="true" :model="productQuery">
          <el-form-item label="商品名称">
            <el-input
                v-model="productQuery.productName"
                maxlength="20"
                placeholder="请输入商品名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getProductList">查询</el-button>
            <el-button type="primary" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
            ref="multipleTableRef"
            :data="groupData"
            border
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            tooltip-effect="dark"
            style="width: 100%; margin-bottom: 15px"
            row-key="productId"
            max-height="600"
            @selection-change="handleSelectionChange"
            v-loading="loading"
        >
          <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
          />
          <el-table-column
              prop="productId"
              label="商品id"
              show-overflow-tooltip
          />
          <el-table-column label="商品主图11" width="120" align="center">
            <template #default="scope">
              <img
                  height="80"
                  width="80"
                  :src="scope.row.image"
                  alt
                  srcset
              />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" width="220" />
          <el-table-column
              prop="priceRange"
              label="售价区间"
              width="220"
          />
          <el-table-column
              prop="stock"
              label="库存"
              width="120"
              show-overflow-tooltip
          />
        </el-table>
        <div class="fenye">
          <el-pagination
              :current-page="productQuery.pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="productQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="saveIdList">确 定</el-button>
        <el-button @click="closeSelect">取 消</el-button>
      </template>
    </el-dialog>
    <!-- 选择区域弹窗 -->
    <el-dialog
        v-model="districtVisible"
        title="选择地区"
        width="35%"
        top="150px"
        class="group-dialog"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :modal="true"
    >
      <div class="district-box">
        <el-input
            v-model="districtFilterText"
            style="width: 240px"
            placeholder="请搜索国家或地区"
        />

        <el-tree
            ref="treeRef"
            style="max-width: 600px; margin-top: 10px"
            class="filter-tree"
            :data="districtData"
            :props="defaultProps"
            show-checkbox
            node-key="code"
            @check="handleCheckChange"
            :filter-node-method="filterNode"
            :default-checked-keys="resourceCheckedKey"
        />
      </div>
      <template #footer>
        <el-button type="primary" @click="saveDistrictIdList">确 定</el-button>
        <el-button @click="closeSelectDistrict">取 消</el-button>
      </template>
    </el-dialog>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-loading="loadingBtn" type="primary" @click="submit">保 存</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logiistics-add {
  padding: 24px 32px;
  .orderAmount-box {
    background: #F5F6FA;
    border-radius: 4px;
    padding: 14px 24px 14px 0;
  }
  .enable-free-text {
    padding-left: 80px;
    color: #8C8C8C;
    font-size: 12px;
    margin-bottom: 8px;
  }
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
  }
  .dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
.selectionr-region {
  .selected-text {
    font-size: 12px;
    font-weight: 500;
    color: #8C8C8C
  }
}
.district-box {
  height: 600px;
  overflow: auto;
}
:deep(.applicable-goods) {
  width: 100%;
  .selectNum {
    width: 20px;
  }
  button {
    position: relative;
    i {
      position: absolute;
      right: -8px;
      top: -8px;
      font-weight: 500;
      font-style: normal;
      border-radius: 50%;
      background: #f56c6c;
      padding: 3px;
      font-size: 12px;
    }
  }
}
:deep(.enableFree) {
  i {
    font-size: 12px;
    color: #999999 !important;
    font-style: normal;
    margin-left: 10px;
  }
}
</style>
