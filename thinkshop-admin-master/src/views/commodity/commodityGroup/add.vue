<template>
  <div class="p24">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="90"
    >
      <el-form-item label="分组名称" prop="name">
        <el-input
          class="w500"
          v-model="formData.name"
          placeholder="请输入分组名称"
        />
      </el-form-item>
      <el-form-item label="分组描述">
        <el-input
          class="w65"
          v-model="formData.remark"
          placeholder="请输入分组描述"
          maxlength="200"
          type="textarea"
          show-word-limit
          resize="none"
          :autosize="{
            minRows: 5,
            maxRows: 5
          }"
        />
      </el-form-item>
      <el-form-item label="分组商品">
        <el-radio-group v-model="formData.type">
          <el-radio :label="0">
            <el-button type="primary" @click="addProduct" :disabled="formData.type===1">手动添加</el-button>
          </el-radio>
          <el-radio :label="1">
            <el-button type="primary">智能添加</el-button>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type===0" label-width="0">
        <div class="com-cell">
          <div class="t-remove">
            <p>已添加商品</p>
            <el-button type="primary" @click="batchRemove">移出分组</el-button>
          </div>
          <el-table
            :data="productOb.rows"
            row-key="productId"
            @select="handleSelect"
            @select-all="handleSelectAll"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
            />
            <el-table-column
              prop="productCode"
              label="商品id"
              show-overflow-tooltip
            />
            <el-table-column label="商品图片" width="110">
              <template #default="scope">
                <img
                  height="40"
                  width="40"
                  :src="scope.row.image"
                  alt=""
                  srcset=""
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="商品名称"
              width="200"
              align="center"
            />
            <el-table-column
              label="售价区间"
              prop="section"
              width="140"
              show-overflow-tooltip
            >
              <template #default="scope">
                {{`${scope.row.skuType===1?'':scope.row.minPrice+'~'}${scope.row.maxPrice}`}}
              </template>
            </el-table-column>
            <el-table-column
              label="库存"
              prop="stock"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="销量"
              prop="sales"
              show-overflow-tooltip
            />
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <el-button type="primary" link @click="removeProduct(scope.row.productId)">移出</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="productOb.total>0"
            :total="productOb.total"
            v-model:page="pageInfo.pageNum"
            v-model:limit="pageInfo.pageSize"
            @pagination="()=>{getProduct()}"
          />
        </div>
      </el-form-item>
      <el-form-item label="满足条件" v-if="formData.type===1">
        <el-radio-group v-model="productRule.screen">
          <el-radio :label="0">全部满足</el-radio>
          <el-radio :label="1">任意满足</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="筛选条件" v-if="formData.type===1">
        <ul class="con-list">
          <li
            v-for="(it, i) in productRule.filters"
            :key="i"
          >
            <el-select class="w200 mr15" v-model="it.type">
              <el-option label="库存" :value="0"/>
              <el-option label="价格" :value="1"/>
              <el-option label="重量" :value="2"/>
              <el-option label="销量" :value="3"/>
            </el-select>
            <el-select class="w200 mr15" v-model="it.condition">
              <el-option label="大于" :value="0"/>
              <el-option label="等于" :value="1"/>
              <el-option label="小于" :value="2"/>
            </el-select>
            <el-input class="w200 mr15" v-model="it.value"/>
            <el-button link type="danger" icon="Delete" v-if="i" @click="handleProductRule(i)"/>
          </li>
          <li>
            <el-button type="primary" @click="handleProductRule('add')">添加筛选条件</el-button>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <el-affix :offset="0" position='bottom'>
      <div class="btn-list">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
      </div>
    </el-affix>
    <ProductComp
      ref='productRef'
      @confirmSelect="confirmSelect"
      :selectedProductIds="selectedProductIds"
      title="手动添加商品"
    />
  </div>
</template>

<script setup>
import ProductComp from './productComp.vue'
import {groupInfo, addGroup, queryProduct, editGroup} from '@/api/commodity'

const route = useRoute()
const {proxy} = getCurrentInstance()
const defaultForm = {
  name: '',
  remark: '',
  type: 0
}
const formData = reactive({...defaultForm})
// 手动添加的商品
const defaultProductOb = {
  total: 0,
  rows: []
}
const defaultPage = {
  pageNum: 1,
  pageSize: 10
}
const productOb = reactive({...defaultProductOb})
// 商品分页
const pageInfo = ref({...defaultPage})
// 已添加的商品
const selectedProductIds = ref([])
// 选中的商品
const selectedIds = ref([])
const formRef = ref(null)
const rules = ref({
  name: [
    {required: true, message: '请输入分组名称', trigger: 'change'}
  ]
})
// 智能添加产品条件
const defaultProductRule = {
  screen: 0,
  filters: [
    {type: '', condition: '', value: ''}
  ]
}
const productRule = reactive(JSON.parse(JSON.stringify(defaultProductRule)))
const productRef = ref(null)
const emits = defineEmits(['refresh'])

watch(selectedProductIds, (val) => {
  getProduct(val)
}, {deep: true})

const submitForm = async(formEl) => {
  if(!formEl) return
  const api = formData.groupId?editGroup:addGroup
  const msgText = formData.groupId?'修改':'新增'
  await formEl.validate(async(valid) => {
    if(valid) {
      const params = Object.assign({}, formData)
      if(params.type===1) {
        params.intelligent = productRule
      } else {
        params.productIds = selectedProductIds.value
      }
      const {code} = await api(params)
      if(code===200) {
        proxy.$modal.msgSuccess(`${msgText}成功`)
        close()
        emits('refresh')
      }
    }
  })
}
function handleProductRule(t) {
  if(t==='add') {
    productRule.filters.push({type: '', condition: '', value: ''})
  } else {
    productRule.filters.splice(t, 1)
  }
}
// 添加商品
function addProduct() {
  productRef.value.open()
}
// 挑选要移除商品
const handleSelect = (e, row) => {
  if (selectedIds.value.includes(row.productId)) {
    // 删除
    selectedIds.value.splice(selectedIds.value.findIndex(it => it === row.productId), 1)
  } else {
    // 新增
    selectedIds.value.push(row.productId)
  }
}
// 全选商品
const handleSelectAll = (e) => {
  if (e.length > 0) {
    e.forEach(item => {
      if (!selectedIds.value.includes(item.productId)) {
        selectedIds.value.push(item.productId)
      }
    });
  } else {
    // 当前页全部删除
    productOb.rows.forEach((row) => {
      const index = selectedIds.value.findIndex(it => it === row.productId);
      selectedIds.value.splice(index, 1);
    });
  }
}
// 移除商品
function removeProduct(id) {
  const ids = id?[id]:selectedIds.value
  ids.forEach(it => {
    if(selectedProductIds.value.includes(it)) {
      selectedProductIds.value.splice(
        selectedProductIds.value.findIndex(i => i===it),
        1
      )
    }
  })
}
// 批量移除商品
function batchRemove() {
  if(selectedIds.value.length) {
    removeProduct()
  } else {
    proxy.$modal.msgError("请选择需要移除的商品")
  }
}
function confirmSelect(ids) {
  selectedProductIds.value = ids
}
// 重置商品
function resetProduct() {
  Object.assign(productOb, defaultProductOb)
  Object.assign(pageInfo, defaultPage)
}
// 手动添加的查询商品列表
function getProduct(ids) {
  if(ids) selectedProductIds.value = ids
  // 没有添加的商品，不再查询商详
  if(!selectedProductIds.value.length) {
    resetProduct()
    return
  }
  queryProduct({...pageInfo.value, productIds: selectedProductIds.value}).then(res => {
    const {total, rows} = res
    Object.assign(productOb, {
      total,
      rows
    })
  })
}
const init = async () => {
  const {groupId=''} = route.query
  if(groupId) {
    formData.groupId = groupId
    // 分组详情
    groupInfo(groupId).then(res => {
      const {type, productIds, name, remark, conditionJson} = res.data
      Object.assign(formData, {name, type, remark})
      if(!type) {
        selectedProductIds.value = productIds || []
      } else {
        Object.assign(productRule, JSON.parse(conditionJson))
      }
    })
  }
}
function close() {
  Object.assign(formData, defaultForm)
  Object.assign(productRule, defaultProductRule)
  resetProduct()
  formRef.value.resetFields()
  const obj = { path: "/commodity/groups" };
  proxy.$tab.closeOpenPage(obj)
}

init()
</script>

<style lang="scss" scoped>
.w500 {
  width: 500px;
}
.w65 {
  width: 65%;
}
.w200 {
  width: 200px;
}
.mr15 {
  margin-right: 15px;
}
.con-list {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    margin-bottom: 10px;
  }
}
.com-cell {
  width: 100%;
  .t-remove {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    p {
      font-weight: 400;
      font-size: 14px;
      color: #8C8C8C;
    }
  }
}
.btn-list {
  background: #FFFFFF;
  text-align: center;
  padding: 30px 0;
}
</style>