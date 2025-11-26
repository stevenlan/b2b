<template>
  <div class="p24">
    <p class="m-title mb24">{{form.id?'编辑':'新增'}}运营计划</p>
    <el-form
      ref="formRef"
      label-width="120px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="计划名称" prop="name">
        <el-input
          class="w250"
          maxlength="20"
          v-model="form.name"
          placeholder="请输入计划名称"
        />
      </el-form-item>
      <el-form-item label="计划人群">
        <div class="form-item">
          <el-button type="primary" class="mb20" @click="groupRef.open()">选择人群</el-button>
          <el-table
            :data="initGroup"
          >
            <el-table-column label="人群名称" prop="name" width="150"/>
            <el-table-column align="center" label="人群定义" prop="" key="">
              <template #default="scope">
                <p>{{ formatRules(scope.row.ruleInfo) }}</p>
              </template>
            </el-table-column>
            <el-table-column label="人群数量" width="150" prop="userCount"/>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" link @click="initGroup.splice(scope.$index, 1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="计划方式" prop="planType">
        <div class="form-item">
          <div>
            <el-radio :label="1" v-model="form.planType">自动长期计划</el-radio>
            <div class="radio-item mb10" v-if="form.planType===1">
              <span>计划执行时间</span>
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
          <div>
            <el-radio :label="2" v-model="form.planType">手动定时计划</el-radio>
            <div class="radio-item" v-if="form.planType===2">
              <el-radio :label="1" v-model="form.manualExecutionType">立即执行</el-radio>
              <div>
                <el-radio :label="2" v-model="form.manualExecutionType">定时执行</el-radio>
                <el-date-picker
                  v-model="carryDate"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="选择时间"
                />
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="发放优惠券配置">
        <div class="form-item">
          <el-button type="primary" class="mb20" @click="couponRef.open()">选择优惠券</el-button>
          <el-table
            :data="initCoupon"
          >
          <el-table-column label="优惠券名称" prop="couponName"/>
          <el-table-column label="类型" width="120">
            <template #default="scope">
              {{`${scope.row.couponType===1?'满减':'折扣'}券`}}
            </template>
          </el-table-column>
          <el-table-column label="内容" prop="remark"/>
          <el-table-column label="库存（张）" width="120">
            <template #default="scope">
              {{ scope.row.number - scope.row.receivedNumber}}
            </template>
          </el-table-column>
            <el-table-column label="发放数量（每人）" width="150">
              <template #default="scope">
                <el-input-number
                  placeholder="请输入"
                  :precision="0"
                  :controls="false"
                  style="width: 110px;"
                  :max="scope.row.number - scope.row.receivedNumber"
                  v-model="scope.row.couponIssueNum"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" link @click="initCoupon.splice(scope.$index, 1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <el-affix :offset="0" position='bottom'>
      <div class="btn-list">
        <el-button class="mr20" @click="close">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </div>
    </el-affix>
    <SelectGroup ref="groupRef" :initGroup="initGroup" @confirmSelect="val => initGroup=val"/>
    <SelectCoupon ref="couponRef" :initCoupon="initCoupon" @confirmSelect="val => initCoupon=val"/>
  </div>
</template>

<script setup>
import SelectGroup from './selectGroup.vue'
import SelectCoupon from './selectCoupon.vue'
import {formatRules} from '../common'
import {addMemberPlan, updateMemberPlan, queryMemberPlanInfo, groupInfo} from '@/api/customer'
import moment from 'moment'

const {proxy} = getCurrentInstance()
const emits = defineEmits(['reload'])
const route = useRoute()
const router = useRouter()

const defaultForm = {
  id: '',
  name: '',
  planType: 1,
  manualExecutionType: 1
}
const form = ref({...defaultForm})
const formRef = ref(null)
const rules = ref({
  name: [{required: true, message: '请输入计划名称'}]
})
const date = ref('')
const carryDate = ref('')
const groupRef = ref(null)
const initGroup = ref([])
const couponRef = ref(null)
const initCoupon = ref([])

function close() {
  const obj = { path: "/customer/operate" };
  proxy.$tab.closeOpenPage(obj)
}
function rFormatDate(t) {
  if(!t) return
  return moment(t).format('YYYY-MM-DD')
}
function init() {
  const {id, groupId} = route.query
  if(id) {
    form.value.id = id
    queryMemberPlanInfo(id).then(r => {
      const res = r.data
      const {planType, manualExecutionType, planStart, planEnd} = res
      initGroup.value = res.memberGroupList || []
      initCoupon.value = res.couponList || []
      if(planType===1) date.value = [rFormatDate(planStart), rFormatDate(planEnd)]
      if(planType===2&&manualExecutionType===2)  carryDate.value = rFormatDate(planStart)
      for(let key in form.value) {
        form.value[key] = res[key]
      }
    })
  }
  // 客户人群快捷创建运营将计划
  if(groupId) {
    groupInfo(groupId).then(r => {
      initGroup.value.push(r.data)
    })
  }
}

function saveForm() {
  const {planType, manualExecutionType, id} = form.value
  const params = {...form.value}
  const msg = id?'编辑':'新增'
  const api = id?updateMemberPlan:addMemberPlan
  if(planType===1) {
    Object.assign(params, {
      planStart: date.value[0],
      planEnd: date.value[1]
    })
  }
  if(planType===2&&manualExecutionType===2) {
    Object.assign(params, {planStart: carryDate.value})
  }
  params.memberGroupIds = initGroup.value.map(it => it.id)
  params.couponRefs = initCoupon.value.map(it => {
    return {
      refId: it.id,
      couponIssueNum: it.couponIssueNum
    }
  })
  formRef.value.validate(valid => {
    if(valid) {
      api(params).then(r => {
        proxy.$modal.msgSuccess(`${msg}成功`)
        emits('reload')
        close()
      })
    }
  })
}

init()
</script>

<style lang="scss" scoped>
.w800 {
  width: 800px;
}
.w50 {
  width: 50%;
}
.mb20  {
  margin-bottom: 20px;
}
.mb10  {
  margin-bottom: 10px;
}
.mr20 {
  margin-right: 15px;
}
.form-item {
  width: 100%;
  .radio-item {
    padding-left: 20px;
    span {
      margin-right: 15px;
    }
  }
  .el-radio  {
    margin-right: 15px;
  }
}
.btn-list  {
  background: #FFFFFF;
  text-align: center;
  padding: 30px 0;
}
</style>