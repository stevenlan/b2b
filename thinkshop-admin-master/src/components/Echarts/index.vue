<template>
  <div class="echarts" :id="domId"></div>
</template>

<script setup>
import * as echarts from 'echarts'

const props = defineProps({
  domId: {
    type: String
  },
  trend: {
    type: Boolean,
    default: false
  },
  homeData: {
    type: Object,
    default: () => {}
  }
})
const {domId, trend} = toRefs(props)

watch(() => props.homeData, val => {
  initEchart()
}, {deep: true})

function initEchart() {
  const myChart = echarts.init(document.getElementById(domId.value))
  const {
    newMemberCountTrend=[],
    turnoverTotalTrend=[],
    trendDateRange=[]} = props.homeData
  // 数据概览
  const options = {
    grid: {
      left: 0,
      top: 10,
      right: 0,
      bottom: 0
    },
    xAxis: {
      data: trendDateRange,
      boundaryGap: false,
      show: false
    },
    yAxis: {
      min: 0,
      show: false
    },
    series: [
      {
        name: '销量',
        type: 'line',
        smooth: true,
        data: props.homeData[`${props.domId}Trend`] || [],
        symbol: 'none',
        areaStyle: {
          origin: 'start',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 1, color: '#FFFFFF' // 0% 处的颜色
            }, {
                offset: 0, color: '#3E70FF' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        labelLine: {
          lineStyle: {
            width: 0.5
          }
        }
      }
    ]
  }
  const trendOpt = {
    grid: {
      left: 50,
      right: 50,
      bottom: 30
    },
    legend: {
      data: ['新增人数', '下单总额'],
      top: 20,
      right: 20
    },
    tooltip: {
      axisPointer: {
        type: 'cross',
        axis: 'y'
      }
    },
    xAxis: {
      data: trendDateRange,
      boundaryGap: false,
    },
    yAxis: {
      min: 0,
    },
    series: [
      {
      name: '新增人数',
      type: 'line',
      smooth: true,
      data: newMemberCountTrend
    },
    {
      name: '下单总额',
      type: 'line',
      smooth: true,
      data: turnoverTotalTrend
    }
    ]
  }
  myChart.setOption(trend.value?trendOpt:options)
  window.addEventListener("resize", () => {
    myChart.resize();
  })
}

onMounted(() => {
  initEchart()
})
</script>

<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%;
}
</style>
