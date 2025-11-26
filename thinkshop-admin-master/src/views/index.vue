<template>
  <div class="app-container home">
    <div class="main-con">
      <div class="quick-nav" v-if="showNav">
        <div class="t-box bt-flex mb20">
          <p>网站快捷设置</p>
          <el-icon class="cursor-p"><Close @click="showNav=false"/></el-icon>
        </div>
        <el-row :gutter="20">
          <el-col v-for="(it, i) in navList" :key="i" :span="12" :lg="6" class="nav-box mb20">
            <div class="bt-flex nav-item cursor-p" @click="toRouter(it)">
              <img alt="" :src="it.img"/>
              <div class="r-con">
                <p>{{it.title}}</p>
                <p>{{it.subText}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="d-box overview">
        <div class="t-box bt-flex">
          <div class="l-p">
            <span>数据概览</span>
            当前时区：(UTC+08:00) 北京时间
          </div>
          <div class="r-p">
            <el-date-picker
              v-model="date"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :shortcuts="shortcuts"
              @change="initData"
            />
          </div>
        </div>
        <el-row :gutter="20">
          <el-col v-for="(it, i) in overviewList" :key="i" :span="12" :lg="6" class="list-cell">
            <div class="l-item">
              <div class="bt-flex l-title">
                <p>{{it.title}}</p>
                <el-tooltip
                  effect="light"
                  :content="it.desc"
                  placement="top"
                >
                  <el-icon><Warning /></el-icon>
                </el-tooltip>
              </div>
              <p class="num">{{it.value}}</p>
              <div class="chart-box">
                <Echarts :domId="it.field" :home-data="homeData" v-if="!['memberCount', 'orderConvertRate', 'payConvertRate'].includes(it.field)"/>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="d-box trend">
        <p>数据趋势</p>
        <div class="trend-chart">
          <Echarts :trend="true" domId="trend" :home-data="homeData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {userStatics} from '@/api/customer'
import decorateIcon from '@/assets/images/decorate.png'
import basicInfoIcon from '@/assets/images/basic_info.png'
import paySettingIcon from '@/assets/images/pay_setting.png'
import langIcon from '@/assets/images/lang.png'
import Echarts from '@/components/Echarts'
import moment from 'moment'
import { computed } from 'vue'

const router = useRouter()

const showNav = ref(true)
const date = ref([moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')])
const navList = ref([
  // {
  //   title: '店铺装修',
  //   path: '',
  //   subText: '网站默认配置了一套模板，如您不满意，请前往装修',
  //   img: decorateIcon
  // },
  {
    title: '基本信息配置',
    path: '/webSettings/basicInfo',
    subText: '配置您的网站基本信息，货币单位、时区等',
    img: basicInfoIcon
  },
  {
    title: '收款配置',
    path: '/webSettings/payment',
    subText: '配置您的税费、收款方式',
    img: paySettingIcon
  },
  {
    title: '语言',
    path: '/webSettings/basicInfo',
    subText: '语言可配置到客户端中，但只有启用后才对用户可见',
    img: langIcon
  }
])
const homeData = ref({})
// 数据概览
const overviewList = computed(() => {
  const rList = [
    {title: '订单笔数', desc: '筛选时间内所有订单合计数量', field: 'ordersCount', data: '500', yData: 'ordersCountTrend'},
    {title: '营收总额', desc: '筛选时间内所有订单合计总额', field: 'turnoverTotal', data: '23'},
    {title: '售后订单数', desc: '筛选时间内所有售后订单数量合计', field: 'saledOrdersCount', data: '23'},
    {title: '售后订单总额', desc: '筛选时间内所有售后订单金额合计', field: 'saledOrdersTotal', data: '224'},
    {title: '新增客户数', desc: '筛选时间内新增客户总数', field: 'newMemberCount', data: '66'},
    {title: '客户总数', desc: '网站注册客户总数', field: 'memberCount', data: '342'},
    {title: '订单转化率', desc: '订单总数/网站访问UV*100%', field: 'orderConvertRate', data: '50%'},
    {title: '付款转化率', desc: '支付买家数/访客数UV*100%', field: 'payConvertRate', data: '66%'},
  ]
  rList.forEach(it => {it.value = homeData.value[it.field] || 0})
  return rList
})
const shortcuts = [
  {
    text: '今日',
    value: () => {
      const end = new Date()
      const start = new Date()
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      return [start, end]
    },
  },
  {
    text: '近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近1月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '全年',
    value: () => {
      const end = new Date()
      const start = new Date(`${new Date().getFullYear()}-01-01`)
      return [start, end]
    },
  }
]

function toRouter(it) {
  if(it.path) router.push(it.path)
}
// 数据统计数据
function initData() {
  let params = date.value[0]?{
    startTime: date.value[0]+' 00:00:00',
    endTime: date.value[1]+' 00:00:00'
  }:{}

  userStatics(params).then(r => {
    homeData.value = r.data
  })
}

initData()
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - 84px);
  .bt-flex {
    display: flex;
    justify-content: space-between;
  }
  .main-con {
    height: 100%;
    .quick-nav {
      background: url('@/assets/images/home-bg.png') no-repeat center;
      background-size: 100% 100%;
      border-radius: 5px;
      padding: 32px 32px 12px;
      box-sizing: border-box;
      .t-box {
        font-weight: 600;
        font-size: 16px;
        color: #262626;
      }
      .nav-box {
        .nav-item {
          background: rgba(255,255,255,0.7);
          border-radius: 5px 5px 5px 5px;
          border: 1px solid #FFFFFF;
          padding: 24px 22px 0 16px;
          height: 118px;
          img {
            width: 43px;
            height: 43px;
            border-radius: 50%;
          }
          .r-con {
            padding-left: 16px;
            flex: 1;
            p {
              font-size: 12px;
              color: #8C8C8C;
              &:nth-child(1) {
                font-size: 14px;
                color: #262626;
                line-height: 22px;
                margin-bottom: 8px;
              }
            }
          }
        }
      }
    }
    .d-box {
      background: #F5F6FA;
      border-radius: 4px;
      padding: 24px;
      margin-top: 24px;
      &.overview {
        .t-box {
          .l-p {
            color: #8C8C8C;
            font-size: 12px;
            span {
              font-weight: 600;
              font-size: 16px;
              color: #262626;
              margin-right: 4px;
            }
          }
        }
        .list-cell {
          .l-item {
            padding: 24px 10px 10px 16px;
            background: rgba(255,255,255,0.7);
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #FFFFFF;
            margin-top: 16px;
            .l-title {
              font-size: 14px;
              color: #8C8C8C;
              margin-bottom: 8px;
            }
            .num {
              font-weight: bold;
              font-size: 24px;
              color: #262626;
            }
            .chart-box {
              height: 80px;
            }
          }
        }
      }
      &.trend {
        p {
          font-weight: 600;
          font-size: 16px;
          color: #262626;
          margin-bottom: 5px;
        }
        .trend-chart {
          height: 350px;
          background: #FFFFFF;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
