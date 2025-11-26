<template>
  <div class="p-rule">
    <el-form :model="form" ref="formRef" class="w800" label-width="100">
      <el-form-item label="积分抵扣" prop="isUse">
        <el-space direction="vertical" alignment="start" :size="0">
          <el-switch
            v-model="form.isUse"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
          <p class="tip">启用积分抵扣，用户在下单支付时，可使用积分抵扣实际支付金额。</p>
        </el-space>
      </el-form-item>
      <el-form-item label="抵扣比例" prop="deductionRatio" v-if="form.isUse===1">
        <div>
          <el-input-number v-model="form.deductionRatio" :controls="false" :min="0"/>
          <p class="tip">每1积分抵扣金额数</p>
        </div>
      </el-form-item>
      <el-form-item label="最多抵扣" prop="" v-if="form.isUse===1">
        <div>
          <el-radio-group v-model="form.deductionType">
            <el-radio :label="1">最多抵扣积分</el-radio>
            <el-radio :label="2">最高抵扣比例</el-radio>
          </el-radio-group>
          <div>
            <el-input-number
              :controls="false"
              :min="0"
              :precision="0"
              v-model="form.deductionValue"
            /><span v-if="form.deductionType===2" style="margin-left: 4px;">%</span>
            <p class="tip">{{form.deductionType===1?'每次下单抵扣积分上限':'每次下单抵扣实际支付金额的最高比例（1%～100%）'}}</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="下单赠送积分" prop="orderAward">
        <div>
          <el-input-number
            :controls="false"
            v-model="form.orderAward"
            :min="0"
          />
          <p class="tip">每消费金额数为1时赠送积分数</p>
        </div>
      </el-form-item>
      <el-form-item label="积分清零" prop="">
        <div>
          <el-radio-group v-model="form.cleanType">
            <el-radio :label="1">年</el-radio>
            <el-radio :label="2">季度</el-radio>
            <el-radio :label="3">月</el-radio>
            <el-radio :label="0">不清零</el-radio>
          </el-radio-group>
          <p class="tip">到期后自动清零上一年/季度/月的积分，或积分永不清零</p>
        </div>
      </el-form-item>
      <el-form-item label="积分规则" prop="">
        <editor v-model="form.describeInfo" :min-height="300"/>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveRule">保存</el-button>
  </div>
</template>

<script setup>
import {queryIntegralRule, updateIntegralRule} from '@/api/customer'

const {proxy} = getCurrentInstance()

const form = ref({})
const formRef = ref(null)

function saveRule() {
  updateIntegralRule(form.value).then(r => {
    proxy.$modal.msgSuccess('保存成功')
  })
}
function initRule() {
  queryIntegralRule().then(r => {
    form.value = r.data
  })
}

initRule()
</script>

<style lang="scss" scoped>
.p-rule {
  display: flex;
  justify-content: space-between;
}
.w800 {
  width: 800px;
}
.tip {
  color: #8C8C8C;
  font-size: 14px;
}
</style>
