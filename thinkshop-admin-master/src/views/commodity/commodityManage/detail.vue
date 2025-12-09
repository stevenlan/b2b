<template>
  <div class="p24">
    <el-row class="mb20">
      <el-col :span="8">
        <p><span class="label">商品ID：</span> {{info.productCode}}</p>
      </el-col>
      <el-col :span="8">
        <p><span class="label">创建时间：</span> {{parseTime(info.createTime)}}</p>
      </el-col>
      <el-col :span="8">
        <p><span class="label">商品名称：</span> {{info.productName}}</p>
      </el-col>
    </el-row>
    <el-row class="mb20">
      <el-col :span="8">
        <p><span class="label">状态：</span> {{info.isShow?"已上架":"已下架"}}</p>
      </el-col>
      <el-col :span="8">
        <p><span class="label">是否收税：</span> {{info.tax?"是":"否"}}</p>
      </el-col>
      <el-col :span="8">
        <p><span class="label">商品类目：</span> {{info.categoryName}}</p>
      </el-col>
    </el-row>
    <el-row class="mb20">
      <el-col :span="8">
        <p>
          <span class="label">商品分组：</span>
          <span class="label-text">{{info.groupName}}</span>
        </p>
      </el-col>
      <el-col :span="8">
        <p>
          <span class="label">商品简介：</span>
          <span class="label-text">{{info.introduce}}</span>
        </p>
      </el-col>
    </el-row>
    <div class="s-flex">
      <p class="label">商品主图：</p>
      <div class="r-p">
        <el-image
            style="width: 80px; height: 80px;margin-right: 10px;"
            :src="item"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale=".2"
            :preview-src-list="[item]"
            :initial-index="4"
            fit="cover"
            v-for="(item, index) in info.image"
            :key="index"
          />
      </div>
    </div>
    <div class="s-flex">
      <p class="label">商品视频：</p>
      <div class="r-p" v-if="info.video">
        <video controls="controls" loop="loop" width="80%" height="400px">
          <source :src="info.video" type="video/mp4"/>
        </video>
      </div>
    </div>
    <div class="s-flex">
      <p class="label">商品规格：</p>
      <div class="r-p">
        <el-col :span="24">
          <el-table :data="skus" size="small" style="width: 90%;">
            <el-table-column type="myindex" v-for="(item) in skuHeader" :key="item.key" :label="item.title" :property="item.slot" align="center">
              <template #default="scope">
                <div v-if="scope.column.property == 'image'" align="center">
                  <img :src="scope.row[scope.column.property]" style="width: 40px;height: 40px;"/>
                </div>
                <div v-else align="center">
                  {{ scope.row[scope.column.property] }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </div>
    </div>
    <div class="s-flex">
      <p class="label">商品详情：</p>
      <div class="r-p" v-html="info.detail"/>
    </div>
  </div>
</template>

<script setup>
import {productInfo, formatAttr} from '@/api/commodity'

const route = useRoute()
const info = ref({image: []})
const skus = ref([])
const skuHeader = ref([])

function init() {
  const {productId} = route.query
  productInfo(productId).then(res => {
    const {data} = res
    const {image, groups} = data
    if(image?.length) {
      data.image = image.split(',')
    }
    if(groups?.length) {
      data.groupName = groups.map(it=>it.name).join(', ')
    }
    info.value = data
    generate(productId, data.attrs)
  })
}
// 重置缓存数据
function close() {
  info.value = {image: []}
  skus.value = []
  skuHeader.value = []
}

// 生成sku
const generate = (id, attrs) => {
  formatAttr(id, { attrs }).then(res => {
    const r = res.data || {}
    skus.value = r.value;
    r.header.pop()
    if(info.value.skuType===1) r.header.shift()
    skuHeader.value = r.header;
  })
}

init()
</script>

<style scoped lang='scss'>
p {
  font-size: 14px;
  color: #262626;
}
.label {
  width: 100px;
  display: inline-block;
  text-align: right;
  margin-right: 8px;
}
.label-text {
  width: calc(100% - 120px);
  display: inline-block;
  vertical-align: top;
}
.s-flex {
    margin-bottom: 20px;
    display: flex;
    .mr20 {
      margin-right: 20px;
    }
    .r-p {
      flex: 1;
      .table {
        width: calc(100% - 120px);
      }
      word-break: break-word;
      video {
        height: auto;
        width: calc(100% - 120px);
      }
    }
  }
</style>
