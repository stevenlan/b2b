<template>
  <div class="p24">
    <p class="m-title mb24">{{form.id?'编辑':'新增'}}人群</p>
    <el-form :model="form" :rules="rules" ref="formRef" class="w800" label-width="100">
      <el-form-item label="人群名称" prop="name">
        <el-input placeholder="请输入人群名称" v-model="form.name" class="w250"/>
      </el-form-item>
      <el-form-item label="特征筛选">
        <ul>
          <li v-for='(it, i) in featureListed' :key="i" class="mb20">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-select v-model="it.type" @change="val=>{handleChange(val, i)}">
                  <el-option v-for="op in featureList" :key="op.type" :label="op.label" :value="op.type" :disabled="op.disabled"/>
                </el-select>
              </el-col>
              <el-col v-if="it.type" :span="8">
                <div v-if="![9, 10, 11].includes(it.type)">
                  最近<el-input-number controls-position="right" class="mr5" v-model="it.value"/>天
                </div>
                <el-select v-if="[9, 10].includes(it.type)" v-model="it.compare">
                  <el-option label="大于" :value='1'/>
                  <el-option label="等于" :value='3'/>
                  <el-option label="小于" :value='2'/>
                </el-select>
                <!-- 标签 -->
                <el-select v-if="it.type===11" v-model="it.value" placeholder="请选择标签" multiple>
                  <el-option v-for="tag in props.tagList" :value="tag.id" :label="tag.name"/>
                </el-select>
              </el-col>
              <el-col :span="8" v-show="it.type">
                <div v-if="[9, 10].includes(it.type)">
                  <el-input-number controls-position="right" class="mr5" v-model="it.value"/>{{it.type===9?'次':''}}
                </div>
              </el-col>
              <el-col :span="2">
                <el-button link type="danger" icon="Delete" v-if="i" @click="reduceFeature(i)"/>
              </el-col>
            </el-row>
            <p v-if="it.type" class="mt5 grey">{{it.msg}}</p>
          </li>
          <li v-if="featureListed.length<11">
            <el-button type="primary" icon="Plus" @click="addFeature">添加筛选特征</el-button>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <el-affix :offset="0" position='bottom'>
      <div class="btn-list">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="saveGroup">保存</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import { computed } from "vue"
import {addGroup, updateGroup, queryGroupInfo} from "@/api/customer"

const route = useRoute()
const {proxy} = getCurrentInstance()
const props = defineProps({
  tagList: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['refresh'])

const form = ref({
  name: ''
})
const rules = ref({
  name: [{required: true, message: '请输入人群名称'}]
})
const formRef = ref(null)
const defaultCon = {label: '有购买', type: 1, msg: '选定时间内，购买过本店商品的客户（以支付成功为准，不剔除退款）'}
const featureListed = reactive([])

const featureList = computed(() => {
  const list = [
    {label: '有购买', type: 1, msg: '选定时间内，购买过本店商品的客户（以支付成功为准，不剔除退款）'},
    {label: '无购买', type: 2, msg: '选定时间内，没有购买过本店商品的客户（以支付成功为准，不剔除退款）'},
    {label: '有下单', type: 3, msg: '选定时间内，在店铺有下单行为的客户（包含未付款客户）'},
    {label: '无下单', type: 4, msg: '选定时间内，在店铺没有下单行为的客户'},
    {label: '有加购', type: 5, msg: '选定时间内，加购过本店商品的客户'},
    {label: '无加购', type: 6, msg: '选定时间内，没有加购过本店商品的客户'},
    {label: '有访问', type: 7, msg: '选定时间内，访问过本店的客户'},
    {label: '无访问', type: 8, msg: '选定时间内，没有访问过本店的客户'},
    {label: '购买次数', type: 9, msg: '客户累计在店铺交易成功的订单数量（剔除退款的订单）'},
    {label: '购买金额', type: 10, msg: '客户累计在店铺交易成功的金额数量（剔除退款金额）'},
    {label: '标签', type: 11, msg: '当前拥有以上任意标签的客户'},
  ]
  list.forEach(it => {
    it.disabled = featureListed.some(ob=>ob.type===it.type)
  })
  return list
})

function handleChange(val, i) {
  const ob = featureList.value.find(it=>it.type===val)
  Object.assign(featureListed[i], ob)
}
function reduceFeature(i) {
  featureListed.splice(i, 1)
}
function addFeature() {
  featureListed.push({})
}
function close() {
  const obj = { path: "/customer/group" };
  proxy.$tab.closeOpenPage(obj)
}
async function init() {
  const {groupId} = route.query
  if(groupId) {
    const res = await queryGroupInfo(groupId)
    const {name, id, ruleInfo} = res.data
    const rules = JSON.parse(ruleInfo)
    Object.keys(rules).forEach(key => {
      let ob = featureList.value.find(j => j.type===Number(key))
      let val = rules[key]
      if(['9', '10'].includes(key)) {
        Object.assign(ob, {
          value: val.value,
          compare: val.condition
        })
      } else if(key==='11') {
        ob.value = val?.length?val.map(o => o.id):[]
      } else {
        ob.value = val
      }
      featureListed.push(ob)
    })
    form.value = {name, id}
  } else {
    featureListed[0] = {...defaultCon}
  }
}
function saveGroup() {
  const ruleInfo = {}
  const {id} = form.value
  const api = id?updateGroup:addGroup
  const msg = id?'修改':'新增'
  featureListed.forEach(it => {
    let {type, compare, value} = it
    let val = value
    if([9, 10].includes(type)) val = {condition: compare, value}
    if(type===11) val = value?.length?props.tagList.filter(o => value.includes(o.id)):{}
    ruleInfo[type] = val
  })
  formRef.value.validate(valid => {
    if(valid) {
      api({
        ...form.value,
        ruleInfo: JSON.stringify(ruleInfo)
      }).then(r => {
        close()
        proxy.$modal.msgSuccess(`${msg}成功`)
        emits('refresh')
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
.btn-list {
  background: #FFFFFF;
  text-align: center;
  padding: 30px 0;
}
ul, li {
  width: 100%;
}
.mb20 {
  margin-bottom: 20px;
}
.mt10 {
  margin-top: 5px;
}
.mr5 {
  margin: 0 5px;
}
.w150 {
  width: 120px;
}
.grey {
  color: #999999;
}
</style>