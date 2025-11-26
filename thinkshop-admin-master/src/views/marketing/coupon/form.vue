<script setup>
import { ElMessage } from 'element-plus'
import {
  addCoupon,
  getProducts,
  couponDetail,
  updateCoupon,
} from '@/api/coupon/index.js'
const route = useRoute()
const router = useRouter();
defineComponent({
  name: 'CouponForm'
})

function initCouponForm () {
  return {
    couponScope: 1, //  适用商品 1-全部商品 2-指定商品可用 3-指定商品不可用
    couponValue: null, // 优惠内容减多少元
    discount: null, // 打多少折
    couponName: '', //  优惠券名称
    couponType: 1, //  优惠券类型 1-满减券 2-折扣券
    expirationDay: null, //  领券当日几天内（天数）
    takingEffectTime: '', //  用券开始时间
    expirationTime: '', //  用券结束时间
    limitNumber: null, //  限制次数
    ids: [], //  选中的商品id数组
    excludeIds: [], // 排除的商品id数组
    number: null, //  发放数量
    receiveType: 1, //  每人限领次数 1-无限次 2-限制几次
    remark: '', //  备注
    id: null, //  优惠券id
    threshold: 0, //  使用门槛满多少元，无门槛为0
    expirationType: 1, //  用券时间 1-固定时间 2-领券当日起几天内可用
  }
}
const visible = ref(false)
const groupVisible = ref(false)
const visitDetail = ref(false)
const form = ref(initCouponForm())
// 优惠券使用的固定时间
const fixedTimeData = ref([])

// 优惠券是否无门槛
const isThreshold = shallowRef(true)
const currentType = shallowRef(1)
const ruleFormRef = ref()
const multipleTableRef = ref()
const groupQuery = ref({
  search: '',
  id: '',
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)
const groupData = ref([])
const multipleSelection = ref([])
// 选中的id
const idList = ref([])

const rules = {
  couponName: [
    { required: true, message: '请输入优惠券名称', trigger: 'blur' },
  ],
  couponValue: [{ required: form.value.couponType === 1, message: '请输入优惠金额' }],
  discount: [{ required: form.value.couponType === 2, message: '请输入打多少折' }],
  number: [
    { required: true, message: '请输入发放数量', trigger: 'blur' },
  ],
}

function init () {
  const {id, isDetail} = route.query
  form.value.id = id
  visitDetail.value = isDetail
  if (id) {
    getCouponInfo()
  }
  visible.value = true
}
function close () {
  visible.value = false
  form.value = initCouponForm()
  groupQuery.value.pageNum = 1
  fixedTimeData.value = []
  idList.value = []
  multipleTableRef.value?.clearSelection()
  ruleFormRef.value?.resetFields()
}

function addCouponFn () {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.expirationType === 1 && fixedTimeData.value.length === 0) {
        ElMessage({
          message: '请选择用券时间开始和结束日期',
          type: 'warning',
        })
        return false
      }
      if (
          form.value.expirationType === 2 &&
          form.value.expirationDay === null
      ) {
        ElMessage({
          message: '请填写领券多久内可以使用时间',
          type: 'warning',
        })
        return false
      }
      if (
          form.value.receiveType === 2 &&
          form.value.limitNumber === null
      ) {
        ElMessage({
          message: '请填写每人限领次数',
          type: 'warning',
        })
        return false
      }
      // if (form.value.couponType === 2) {
      //   var regExp = /^([1-9]{1})(.\d{1})?$/
      //   if (!regExp.test(form.value.couponValue)) {
      //     ElMessage({
      //       message: '格式输入不正确',
      //       type: 'warning',
      //     })
      //     return false
      //   }
      // }
      if ([2, 3].includes(parseInt(form.value.couponScope))) {
        if (
            !form.value.ids ||
            !form.value.ids.length ||
            form.value.ids.length === 0
        ) {
          ElMessage({
            message: '请选择指定商品',
            type: 'warning',
          })
          return false
        }
      }
      // 如果所有校验都通过，进行数据转化和接口请求代码
      let date1 = new Date(fixedTimeData.value[0]);
      let date2 = new Date(fixedTimeData.value[1]);
      form.value.takingEffectTime = date1.getTime();
      form.value.expirationTime = date2.getTime();
      if (form.value.id) {
        updateCoupon(form.value).then((res) => {
          if (res.code === 200) {
            ElMessage.success('修改成功')
            form.value = initCouponForm()
            visible.value = false
            goToCoupon()
          } else {
            ElMessage.error(res.message)
          }
        })
      } else {
        addCoupon(form.value).then((res) => {
          if (res.code === 200) {
            ElMessage.success('提交成功')
            form.value = initCouponForm()
            visible.value = false
            goToCoupon()
          } else {
            ElMessage.error(res.message)
          }
        })
      }
    } else {
      return false
    }
  })
}

// 选择商品
function chooseProduct (type) {
  groupVisible.value = true
  if (currentType.value !== type) {
    idList.value = []
    if (multipleSelection.value.length !== 0) {
      multipleTableRef.value.clearSelection()
    }
  }
  currentType.value = type
  getProList()
}

function getProList () {
  console.log(visitDetail.value, 'dsfdsfs', form.value.scopeValues)
  if (visitDetail.value) {
    groupQuery.value.productIds = form.value.ids
  }
  getProducts(groupQuery.value).then((res) => {
    groupData.value = res.rows
    total.value = res.total
    // 点击编辑时回显表格勾选
    if (form.value.id) {
      for (let i = 0; i < groupData.value.length; i++) {
        if (idList.value.includes(groupData.value[i].productId)) {
          multipleTableRef.value.toggleRowSelection(groupData.value[i])
        }
      }
    }
  })
}
function handleSizeChange (val) {
  groupQuery.value.pageSize = val
  getProList()
}
function handleCurrentChange (val) {
  groupQuery.value.pageNum = val
  getProList()
}

// 选中商品
function handleSelectionChange (val) {
  multipleSelection.value = val
}
// 保存选择商品ID
function saveIdList () {
  idList.value = []
  multipleSelection.value.forEach((i) => {
    idList.value.push(i.productId)
  })
  form.value.ids = idList.value
  form.value.couponScope = currentType.value
  groupVisible.value = false
}
// 取消选择
function closeSelect () {
  groupVisible.value = false
}
// 跳转优惠券列表
function goToCoupon () {
  router.back();
}

const loading = ref(false) // 页面加载
function getCouponInfo () {
  loading.value = true
  couponDetail(form.value.id).then(res => {
    form.value = Object.assign(form.value, res.data)
    fixedTimeData.value = [formatDate(form.value.takingEffectTime), formatDate(form.value.expirationTime)]
    if (form.value.couponScope === 2 || form.value.couponScope === 3) {
      idList.value = JSON.parse(form.value.scopeValues)
      form.value.ids = idList.value
    } else {
      idList.value = []
    }
    currentType.value = res.data.couponScope
    loading.value = false
  })
}
function changeThreshold (val) {
  // 输入框值改变
  if (val) {
    form.value.threshold = 0
  }
}

function proving1 (e) {
  var keynum = window.event ? e.keyCode : e.which // 获取键盘码
  // var keychar = String.fromCharCode(keynum) // 获取键盘码对应的字符
  if (
      e.key
          .replace(/[^\d^\.]+/g, '')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.') === '' &&
      keynum !== 8
  ) {
    ElMessage.warning('禁止输入中文或空')
    e.target.value = ' '
  }
}

function formatDate(timestamp){
  let dateInstance = new Date(timestamp);
  let year = dateInstance.getFullYear();
  let month = ("0" + (dateInstance.getMonth() + 1)).slice(-2);
  let day = ("0" + dateInstance.getDate()).slice(-2);
  let hours = ("0" + dateInstance.getHours()).slice(-2);
  let minutes = ("0" + dateInstance.getMinutes()).slice(-2);
  let seconds = ("0" + dateInstance.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
init()
</script>
<template>
  <!-- 新增活动 -->
  <div v-loading="loading">
    <div class="addCouponBox">
      <h3>{{form.id ? (visitDetail ? '查看优惠券' : '修改优惠券') : '新增优惠券'}}</h3>
      <el-form
        ref="ruleFormRef"
        class="formBox"
        :model="form"
        :rules="rules"
        label-width="120px"
        :disabled="visitDetail"
      >
        <el-form-item label="优惠券类型">
          <el-radio v-model="form.couponType" :label="1">满减券</el-radio>
          <el-radio v-model="form.couponType" :label="2">折扣券</el-radio>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input
            v-model="form.couponName"
            maxlength="20"
            placeholder="请输入优惠券名称"
            onblur="value=value.replace(/(^\s*)|(\s*$)/g, '')"
            style="width: 264px;"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            maxlength="200"
            placeholder="请输入备注"
            style="width: 264px;"
          />
        </el-form-item>
        <el-form-item class="inputW" label="使用门槛" prop="threshold">
          订单满
          <el-input-number
            v-model="form.threshold"
            :disabled="isThreshold"
            :controls="false"
            :max="999999999"
            :min="0"
            :precision="2"
            :step="0.01"
            style="margin: 0 8px;"
          />
          <el-checkbox
            v-model="isThreshold"
            @change="changeThreshold"
          >无门槛</el-checkbox>
        </el-form-item>
        <el-form-item
          v-if="form.couponType === 1"
          class="inputW"
          label="优惠内容"
          prop="couponValue"
        >
          减
          <el-input-number
            v-model="form.couponValue"
            :controls="false"
            :max="999999999"
            :min="0"
            :precision="2"
            :step="0.01"
            style="margin: 0 8px;"
          />
        </el-form-item>
        <el-form-item
          v-else
          class="inputW discount"
          label="优惠内容"
          prop="discount"
        >
          打
          <el-input-number
            v-model="form.discount"
            :controls="false"
            :min="0.1"
            :max="9.9"
            :precision="1"
            :step="0.1"
            style="margin: 0 8px;"
          />
          折
          <label>输入值要大于0 小于10，可保留一位小数</label>
        </el-form-item>
        <el-form-item class="timeDataBox" label="用券时间">
          <el-radio v-model="form.expirationType" :label="1">固定时间</el-radio>
          <div class="dateBox">
            <el-form-item>
              <el-date-picker
                v-model="fixedTimeData"
                :disabled="form.expirationType === 2"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item class="boxWidth">
          <el-radio v-model="form.expirationType" :label="2">领券当日起</el-radio>
          <el-input
            v-model="form.expirationDay"
            maxlength="9"
            :disabled="form.expirationType !== 2"
            oninput="value=value.replace(/[^\d]/g,'')"
          />天内可用
        </el-form-item>
        <el-form-item class="boxWidth" label="发放数量" prop="number">
          <el-input
            v-model="form.number"
            maxlength="9"
            oninput="value=value.replace(/[^\d]/g,'')"
          />张
        </el-form-item>
        <el-form-item class="boxWidth" label="每人限领次数">
          <el-radio v-model="form.receiveType" :label="1">无限制</el-radio>
          <el-radio v-model="form.receiveType" :label="2">限制</el-radio>
          <el-input
            v-model="form.limitNumber"
            maxlength="9"
            :disabled="form.receiveType === 1"
            oninput="value=value.replace(/[^\d]/g,'')"
          />次
        </el-form-item>
        <el-form-item class="couponScope" label="适用商品" prop="couponScope">
          <div class="commodity-selection">
            <div class="selection-item">
              <el-radio v-model="form.couponScope" :label="1">全部商品</el-radio>
            </div>
            <div class="selection-item">
              <el-radio
                  v-model="form.couponScope"
                  :label="2"
                  @change="chooseProduct(2)"
              >指定商品可用</el-radio>
              <span
                  v-if="!visitDetail"
                  class="selectBtn"
                  @click="chooseProduct(2)"
              >
            请选择
            <i
                v-if="form.couponScope === 2 && idList.length !== 0"
                class="selectNum"
            >
              {{ idList.length }}
            </i>
          </span>
              <span
                  v-if="visitDetail && form.couponScope === 2"
                  class="selectBtn"
                  @click="chooseProduct(2)"
              >
            查看商品
            <i
                v-if="form.couponScope === 2 && idList.length !== 0"
                class="selectNum"
            >
              {{ idList.length }}
            </i>
          </span>
            </div>
            <div class="selection-item">
              <el-radio
                  v-model="form.couponScope"
                  :label="3"
                  @change="chooseProduct(3)"
              >指定商品不可用</el-radio>
              <span
                  v-if="!visitDetail"
                  class="selectBtn"
                  @click="chooseProduct(3)"
              >
            请选择
            <i
                v-if="form.couponScope === 3 && idList.length !== 0"
                class="selectNum"
            >
              {{ idList.length }}
            </i>
          </span>
              <span
                  v-if="visitDetail && form.couponScope === 3"
                  class="selectBtn"
                  @click="chooseProduct(3)"
              >
            查看商品
            <i
                v-if="form.couponScope === 3 && idList.length !== 0"
                class="selectNum"
            >
              {{ idList.length }}
            </i>
          </span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button
          v-if="visitDetail"
          type="primary"
          @click="goToCoupon"
      >取 消</el-button>
      <el-button v-else @click="goToCoupon">取 消</el-button>
      <el-button
        v-show="!visitDetail"
        type="primary"
        @click="addCouponFn"
      >保 存</el-button>
    </div>
    <!-- 选择商品弹窗 -->
    <el-dialog
      v-model="groupVisible"
      :title="visitDetail ? '查看商品' : '选择商品'"
      width="70%"
      top="50px"
      class="group-dialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
    >
      <!-- 表格 -->
      <div class="formSearch">
        <el-form :inline="true" :model="groupQuery">
          <el-form-item label="商品ID">
            <el-input
                v-model="groupQuery.id"
                maxlength="20"
                placeholder="请输入商品ID"
            />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input
                v-model="groupQuery.search"
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
        >
          <el-table-column
            v-if="!visitDetail"
            type="selection"
            :reserve-selection="true"
            width="55"
          />
          <el-table-column label="产品主图" width="220" align="center">
            <template #default="scope">
              <img height="80" width="80" :src="scope.row.image" alt srcset />
            </template>
          </el-table-column>
          <el-table-column prop="productName" align="center" label="产品名称" width="220" />
          <el-table-column prop="productId" align="center" label="产品id" show-overflow-tooltip />
          <el-table-column prop="priceRange" align="center" label="原价" />
          <el-table-column prop="stock" align="center" label="库存（件）" />
          <el-table-column prop="state" align="center" label="状态">
            <template #default="scope">
              <span>已上架</span>
<!--              <span>已下架</span>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="groupQuery.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="groupQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <template #footer>
        <div class="footBtnBox">
          <span class="dialog-footer">
            <el-button
              v-if="!visitDetail"
              type="primary"
              @click="saveIdList"
            >确 定</el-button>
            <el-button @click="closeSelect">取 消</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.addCouponBox {
  padding: 16px 24px;
  h3 {
    height: 42px;
    line-height: 42px;
    background: #F5F6FA;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 30px;
    padding-left: 15px;
    font-size: 16px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}
.addCoupon {
  background: #ffffff;
  .dialog-footer {
    display: flex;
    justify-content: center;
    .el-button {
      margin: 0px 16px;
    }
  }
  .formBox {
    .flexBox {
      display: flex;
    }
    .couponScope {
      span {
        width: 100px;
        height: 30px;
        line-height: 30px;
        background: #66b1ff;
        color: #ffffff;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        margin-right: 30px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        i {
          position: absolute;
          right: -10px;
          top: -10px;
          width: 25px;
          height: 25px;
          line-height: 25px;
          background: #ffffff;
          border-radius: 50%;
          border: 1px solid #66b1ff;
          text-align: center;
          color: #3A68F2;
          font-style: normal;
          font-size: 12px;
        }
      }
    }
  }
  .footBtnBox {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  .dateBox {
    display: flex;
    align-items: center;
    .description {
      width: 59px;
      text-align: center;
      display: block;
      font-size: 14px;
      color: #999999;
    }
  }
  .discount label {
    color: #cccccc;
    font-weight: 500;
    padding-left: 30px;
  }
}
:deep(.commodity-selection) {
  .selection-item {
    margin-bottom: 10px;
    .selectBtn {
      font-size: 14px;
      color: #2662F6;
    }
  }
  .el-radio__label {
    width: 100px;
  }
}
</style>

<style scoped>
:deep(.flexBox) .el-input {
  width: 300px;
}
:deep(.inputW) .el-input,
.el-input-number {
  width: 100px;
  /* margin: 0 8px; */
}
:deep(.inputW) .el-input .el-input__inner {
  text-align: center;
}
:deep(.inputW) .el-form-item__error {
  padding-left: 25px;
}
:deep(.inputW) .el-checkbox {
  margin-left: 20px;
}
:deep(.inputW) .el-radio {
  margin-left: 30px;
}
:deep(.boxWidth) .el-input {
  width: 100px;
  margin-right: 15px;
}
:deep(.boxWidth) .el-input .el-input__inner {
  text-align: center;
}
:deep(.addCoupon) .el-button--primary {
  background: #3A68F2;
  border-color: #3A68F2;
}
:deep(.addCoupon) .el-dialog__header {
  background-color: #3A68F2;
}
:deep(.addCoupon) .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}
:deep(.addCoupon) .timeDataBox .el-form-item__content {
  display: flex;
  align-items: center;
}
:deep(.addCoupon) .timeDataBox .el-form-item__label {
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
