<template>
  <div class="p24">
    <el-form
      :model="formData"
      :rules="rules"
      label-width="100px"
      ref="formRef"
    >
      <div class="part">
        <p class="title">基本信息</p>
        <div class="form-box">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品标题" prop="productName">
                <el-input
                  v-model="formData.productName"
                  maxlength="100"
                  placeholder="请输入商品标题"
                  class="w500"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上架状态" prop="isShow">
                <el-radio-group v-model="formData.isShow">
                  <el-radio :label="1">上架</el-radio>
                  <el-radio :label="0">下架</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否收税" prop="tax">
                <el-radio-group v-model="formData.tax">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品简介" prop="introduce">
                <el-input
                  v-model="formData.introduce"
                  maxlength="200"
                  placeholder="请输入商品简介"
                  show-word-limit
                  type="textarea"
                  resize="vertical"
                  :autosize="{ minRows: 2, maxRows: 8 }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品类目" prop="categoryId">
                <el-tree-select
                  v-model="formData.categoryId"
                  :data="categoryList"
                  check-strictly
                  :props="treeProps"
                  :render-after-expand="false"
                  placeholder="请选择商品类目"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品品牌" prop="brandId">
                <el-select
                  v-model="formData.brandId"
                  :multiple="false"
                  style="width: 100%"
                  placeholder="请选择商品品牌"
                >
                  <el-option
                    v-for="it in brandList"
                    :label="it.name"
                    :value="it.id"
                    :key="it.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品分组">
                <el-select
                  v-model="formData.groupIds"
                  :multiple="true"
                  style="width: 100%"
                  placeholder="请选择商品分组"
                >
                  <el-option
                    v-for="it in groupList"
                    :label="it.name"
                    :value="it.groupId"
                    :key="it.groupId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="商品主图" prop="image">
            <div>
              <el-upload
                list-type="picture-card"
                accept="'.png, .jpeg, .jpg, .webp'"
                :limit="10"
                :action="uploadUrl"
                :data="uploadSetting.data"
                :headers="uploadSetting.headers"
                :file-list="formData.image"
                :on-preview="previewFile"
                :on-success="(res, file, files)=>{uploadSuccess(res, file, files, 'image')}"
                :on-remove="(file, files)=>{removeFile(file, files, 'image')}"
                :before-upload="beforeUpload"
                :class="formData.image.length === 10?'hide_box':''"
              >
                <div class="upload-icon-cell">
                  <img :src="imgUploadIcon">
                  <p>上传照片</p>
                </div>
              </el-upload>
              <p class="img-tip">默认第一张为主图；最多可上传10张，图片上传支持bmp、png、jpeg、jpg、gif格式，仅支持上传1M以内的图片</p>
            </div>
          </el-form-item>
          <el-form-item label="商品视频" prop="video">
            <div>
              <el-upload
                list-type="picture-card"
                :limit="1"
                accept=".mp4, .webm"
                :headers="uploadSetting.headers"
                :action="uploadUrl"
                :file-list="formData.video"
                :on-success="(res, file, files)=>{uploadSuccess(res, file, files, 'video')}"
                :before-upload="beforeUpload"
                :class="formData.video.length === 1?'hide_box':''"
              >
                <div class="upload-icon-cell">
                  <img :src="videoUploadIcon">
                  <p>上传视频</p>
                </div>
                <template #file="{ file }">
                  <div style="width: 100%;">
                    <video controls="controls" loop="loop" width="100%" height="100%" v-if="formData.video[0]">
                      <source :src="formData.video[0].url" type="video/mp4" />
                    </video>
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-delete"
                        @click="removeFile(file, {}, 'video')"
                      >
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                  </div>
                </template>
              </el-upload>
              <p class="img-tip">最多支持上传15分钟长度的视频</p>
            </div>
          </el-form-item>
          <el-form-item label="商品详情" prop="detail">
            <WangEditor v-model="formData.detail"/>
          </el-form-item>
        </div>
      </div>
      <div class="part">
        <p class="title">规格信息</p>
        <div class="form-box">
          <el-form-item label="商品规格" required>
            <el-radio-group v-model="formData.skuType">
              <el-radio :label="1">单规格</el-radio>
              <el-radio :label="2">多规格</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 多规格设置-->
          <el-col :span="24" v-if="formData.skuType === 2" class="noForm">
            <el-form-item label=" " v-if="attrs.length!==0">
              <el-col class="mb20">
                <div  v-for="(item, index) in attrs" :key="index" style="width:100%;">
                  <div class="acea-row row-middle"><span class="mr5">{{item.value}}</span>
                    <el-icon @click="handleRemoveRole(index)"><CircleClose /></el-icon>
                  </div>
                  <div class="rulesBox">
                    <el-tag closable color="primary" v-for="(j, indexn) in item.detail" :key="indexn" :name="j" class="mr20" @close="handleRemove2(item.detail,indexn)">{{j}}</el-tag>
                    <el-input
                      placeholder="请输入属性名称"
                      v-model="item.detail.attrsVal"
                      style="width: 150px"
                      maxlength="20"
                    >
                      <template #append>
                        <el-button  type="primary" @click="createAttr(item.detail.attrsVal,index)">添加</el-button>
                      </template>
                    </el-input>
                  </div>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item label=" "   v-if="createBnt">
              <el-col :span=24 >
                <el-col>
                  <el-button type="primary" @click="addBtn" class="mr15" v-if="attrs.length<5">添加新规格</el-button>
                  <el-button type="success" @click="generate">立即生成</el-button>
                </el-col>
              </el-col>
            </el-form-item>
            <el-col :span="24" v-if="showIput">
              <el-col  :xl="6" :lg="9" :md="10" :sm="24" :xs="24" >
                <el-form-item label="规格：">
                  <el-input  placeholder="请输入规格" v-model="formDynamic.attrsName"  maxlength="10"/>
                </el-form-item>
              </el-col>
              <el-col  :xl="6" :lg="9" :md="10" :sm="24" :xs="24">
                <el-form-item label="规格值：">
                  <el-input v-model="formDynamic.attrsVal" placeholder="请输入规格值"  maxlength="20"/>
                </el-form-item>
              </el-col>
              <el-form-item label=" ">
                <el-button type="primary" @click="createAttrName">确定</el-button>
                <el-button type="danger" @click="offAttrName" >取消</el-button>
              </el-form-item>
            </el-col>
            <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" v-if="manyFormValidate.length && formData.header.length!==0 && attrs.length!==0">
              <!-- 多规格表格-->
              <el-col :span="24">
                <el-form-item label="商品属性：" class="labeltop">
                  <el-table v-if="showTable" :data="manyFormValidate" size="small" style="width: 90%;">
                    <el-table-column type="myindex" v-for="(item) in formData.header" :key="item.key" :label="item.title" :property="item.slot" align="center">
                      <template #default="scope">
                        <div v-if="scope.column.property == 'image'" align="center">
                          <UploadImg v-model="scope.row[scope.column.property]"/>
                        </div>
                        <div v-else-if="scope.column.property.indexOf('value') != -1" align="center">
                          {{ scope.row[scope.column.property] }}
                        </div>
                        <div v-else-if="scope.column.property == 'action'" align="center" >
                          <a @click="delAttrTable(scope.$index)" align="center">删除</a>
                        </div>
                        <div v-else align="center">
                          <el-input  v-model="scope.row[scope.column.property]" align="center" />
                        </div>
                      </template>
                    </el-table-column>

                  </el-table>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>
          <!-- 单规格表格-->
          <el-col :xl="23" :lg="24" :md="24" :sm="24" :xs="24" v-if="formData.skuType === 1">
            <el-form-item >
              <el-table :data="oneFormValidate"  size="small" style="width: 90%;">
                <el-table-column prop="image" label="图片" align="center" width="120">
                  <template #default="scope">
                    <UploadImg v-model="scope.row.image"/>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="售价" align="center">
                  <template #default="scope">
                    <el-input type="text" v-model="scope.row.price"/>
                  </template>
                </el-table-column>
                <el-table-column prop="originalPrice" label="原价" align="center">
                  <template #default="scope">
                    <el-input type="text" v-model="scope.row.originalPrice"/>
                  </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" align="center">
                  <template #default="scope">
                    <el-input type="text" v-model="scope.row.stock" maxlength="7"/>
                  </template>
                </el-table-column>
                <el-table-column prop="weight" label="重量" align="center">
                  <template #default="scope">
                    <el-input type="text" v-model="scope.row.weight"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </div>
      </div>
    </el-form>
    <el-dialog v-model="dialogVisible">
      <img style="height: 60%;width: 100%;" :src="dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
    <el-affix :offset="0" position='bottom'>
      <div class="btn-list">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmForom(formRef)">确定</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import {queryCategory, queryBrand, queryGroup, addProduct, updateProduct, productInfo, formatAttr} from '@/api/commodity'
import { WangEditor } from "@/components/Wangeditor/index.js";
import { getToken } from "@/utils/auth";
import UploadImg from './uploadFile.vue'
import imgUploadIcon from '@/assets/images/img_upload.png'
import videoUploadIcon from '@/assets/images/video_upload.png'

const route = useRoute()
const {proxy} = getCurrentInstance()

const emits = defineEmits()
const defaultForm = {
  productId: '',
  productName: '',
  introduce: '',
  isShow: 1,
  tax: 1,
  categoryId: '',
  brandId: '',
  groupIds: [],
  image: [],
  video: [],
  skuType: 1,
  detail: '',
  header: []
}
const formData = reactive(JSON.parse(JSON.stringify(defaultForm)))
const formRef = ref(null)
const rules = ref({
  productName: [
    {required: true, message: '请输入商品标题'}
  ],
  image: [
    { required: true, message: '请上传商品主图'},
  ],
  detail: [
    { required: true, message: '请填写商品详情'},
  ],
  categoryId:  [
    {required: true, message: '请选择商品类目'}
  ],
  brandId:  [
    {required: true, message: '请选择商品品牌'}
  ]
})
const categoryList = ref([])
const brandList = ref([])
const groupList = ref([])
const treeProps = ref({
  children: 'child',
  label: 'name',
  value: 'categoryId'
})
const brandProps = ref({
  label: 'name',
  value: 'id'
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 上传文件
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
let uploadSetting = reactive({
  headers: {
    Authorization: "Bearer " + getToken()
  }
})
// 商品规格信息
const attrs = ref([])
const createBnt = ref(true)
const showIput = ref(false)
// 规格数据
const formDynamic = reactive({
  attrsName: '',
  attrsVal: ''
})
// 多规格sku
const showTable = ref(true)
const manyFormValidate = ref([])
const oneFormValidate = ref([
  {
    detail: {},
    image: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    weight: 0
  }
])

// 上传图片、视频
function previewFile(uploadFile) {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
function beforeUpload(file) {
  const {size, type} = file
  if(type.indexOf('image') > -1&&size / 1024 / 1024 > 1) {
    proxy.$modal.msgWarning('图片大小不能超过1M!')
    return false
  }
  if(type.indexOf('video') > -1&&size / 1024 / 1024 > 30) {
    proxy.$modal.msgWarning('视频大小不能超过30M!')
    return false
  }
  return true
}
function uploadSuccess(res, file, files, field) {
  const {code, data={}, msg} = res
  if(code!==200) {
    return
  }
  const url = res.data.url;
  if(field==='image') formRef.value.clearValidate('image')
  formData[field].push({
    imgPath: url,
    url,
    uid: file.uid
  })
}
function removeFile(file, files, field) {
  const { uid } = file
  const urlIndex = formData[field].findIndex(x => x.uid === uid)
  if(urlIndex > -1) formData[field].splice(urlIndex, 1)
}

/* ------商品规格------ */
// 添加按钮
const addBtn =  () => {
  clearAttr()
  createBnt.value = false
  showIput.value = true
}
const clearAttr = () => {
  formDynamic.attrsName = ''
  formDynamic.attrsVal = ''
}
// 添加规则名称
const createAttrName = () =>{
  if (formDynamic.attrsName && formDynamic.attrsVal) {
    let data = {
      value: formDynamic.attrsName,
      detail: [
        formDynamic.attrsVal
      ]
    };
    attrs.value.push(data);
    var hash = {};
    attrs.value = attrs.value.reduce(function (item, next) {
      hash[next.value] ? '' : hash[next.value] = true && item.push(next);
      return item
    }, [])
    clearAttr();
    showIput.value = false;
    createBnt.value = true;
  } else {
      proxy.$modal.msgWarning('请添加完整的规格！')
  }
}
// 取消
const offAttrName = () => {
  showIput.value = false
  createBnt.value = true
}
// 删除规格
const handleRemoveRole = (index) => {
  attrs.value.splice(index, 1);
  manyFormValidate.value.splice(index, 1);
}
// 添加属性
const createAttr = (num, idx) => {
  if (num) {
    attrs.value[idx].detail.push(num);
    var hash = {};
    attrs.value[idx].detail = attrs.value[idx].detail.reduce(function (item, next) {
      hash[next] ? '' : hash[next] = true && item.push(next);
      return item
    }, [])
  } else {
    proxy.$modal.msgWarning('请添加属性！')
  }
}
// 删除属性
const handleRemove2 = (item, index) => {
  item.splice(index, 1);
}
// 删除表格中的属性
const delAttrTable  = (index) => {
  manyFormValidate.value.splice(index, 1)
}
// 立即生成
const generate = () => {
  formatAttr(formData.productId || 0, { attrs: attrs.value }).then(res => {
    const r = res.data || {}
    if(formData.skuType===2) {
      showTable.value = false
      manyFormValidate.value = r.value;
      let headerdel = {
        title: '操作',
        slot: 'action',
        fixed: 'right',
        width: 220
      };
      r.header.push(headerdel);
      formData.header = r.header;
      let header = r.header;
      header.pop();
      if (!formData.productId&&formData.image.length) {
        manyFormValidate.value.map((item) => {
          item.image = formData.image[0].url
        });
      }
      showTable.value = true
    } else {
      oneFormValidate.value = r.value
    }
  }).catch(res => {
    console.log('err:'+res)
  })
}

// 格式商品视频和主图
function deFormatFile(file) {
  if(file) {
    return file.split(',').map(it => {
      return {
        url: it,
        imgPath: it
      }
    })
  }
  return []
}
// 初始化类目和分组数据
async function init() {
  const {id=''} = route.query
  try {
    const {rows=[]} = await queryCategory()
    const {rows:brandRows=[]} = await queryBrand()
    const {rows:groupRows=[]} = await queryGroup({pageNum: 1, pageSize: 999})
    categoryList.value = rows
    brandList.value = brandRows
    groupList.value = groupRows
    initInfo(id)
  } catch(err) {
    initInfo(id)
  }
}
// 初始化详情数据
async function initInfo(id) {
  if(!id) return
  formData.productId = id
  const {data={}} = await productInfo(id)
  const {video, image, groups} = data
  attrs.value = data.attrs
  generate()
  data.video = deFormatFile(video)
  data.image = deFormatFile(image)
  if(groups?.length) data.groupIds = groups.map(it=>it.groupId)
  Object.assign(formData, data)
}
// 重置缓存数据
function closeDialog() {
  clearAttr()
  attrs.value = []
  manyFormValidate.value = []
  groupList.value = []
  categoryList.value = []
  brandList.value = []
  Object.assign(formData, defaultForm)
  formRef.value.resetFields()
}
// 取消
function cancel() {
  const obj = { path: "/commodity/management" };
  proxy.$tab.closeOpenPage(obj)
}


// 获取文件资源
function formatFile(file) {
  if(file.length) {
    return file.map(it=>it.url).join(',')
  }
  return ''
}
// 提交商品信息
function confirmForom(formEl) {
  if(!formEl) return
  const {productId, image, video, skuType} = formData
  const params = {...formData}
  const api = productId?updateProduct:addProduct
  const msgText = productId?'修改':'新增'

  Object.assign(params, {
    image: formatFile(image),
    video: formatFile(video)
  })
  formEl.validate((valid, err) => {
    if(valid) {
      params.attrs = skuType===2?attrs.value: [{value: '', detail: []}]
      params.skus = skuType===2?manyFormValidate.value:oneFormValidate.value
      if(params.attrs.length===0) {
        return proxy.$modal.msgWarning('请添加商品规格！')
      }
      if(params.skus.length===0){
        return proxy.$modal.msgWarning('请点击生成规格！')
      }
      api(params).then(r => {
        cancel()
        emits('reload')
        proxy.$modal.msgSuccess(`${msgText}成功`)
      })
    } else {
      if(err) {
        let errList = []
        Object.entries(err).forEach(([key, value]) => {
          errList = [...errList, ...value]
        })
        if(errList.length) proxy.$modal.msgError(errList[0].message)
      }
    }
  })
}

init()
</script>

<style lang="scss" scoped>
.part {
  .title {
    background: #F5F6FA;
    font-weight: 600;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
    padding-left: 16px;
    border-radius: 4px;
    color: #262626;
  }
  .form-box {
    padding:10px 0 30px 0px;
    .w500 {
      width: 500px;
    }
  }
}
.img-tip {
  font-size: 12px;
  color: #8C8C8C;
}
.btn-list {
  background: #FFFFFF;
  text-align: center;
  padding: 30px 0;
}
.hide_box :deep(.el-upload--picture-card) {
  display: none;
}
:deep(.el-upload-list) {
  video {
    height: 100%;
    width: 100%;
  }
}
:deep(.el-upload-list--picture-card) {
  .el-upload-list__item, .el-upload--picture-card {
    height: 80px;
    width: 80px;
    background: #F8F8F8;
    border-radius: 2px 2px 2px 2px;
    border: none;
    &:hover {
      color: initial;
    }
  }
  .upload-icon-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;
    img {
      height: 32px;
      width: 32px;
    }
    p {
      font-size: 12px;
      line-height: initial;
    }
  }
}

.mr5 {
  margin-right: 5px;
}
.mr15 {
  margin-right: 15px;
}
.mb20 {
  margin-bottom: 20px;
}
.acea-row {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-lines: multiple;
    -moz-box-lines: multiple;
    -o-box-lines: multiple;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    /* 辅助类 */
}
.acea-row.row-middle {
    -webkit-box-align: center;
    -moz-box-align: center;
    -o-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}
</style>