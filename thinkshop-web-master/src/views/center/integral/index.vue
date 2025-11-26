<script setup>
import {integralTotal, integralBill} from '@/api/integral'
import queIcon from '@/assets/images/qus.png'
import { useI18n} from 'vue-i18n'

const { t } = useI18n();
const router = useRouter()

const total = ref(0)
const page = ref({
  pageNum: 1,
  pageSize: 10
})
const dataObj = ref({
  total: 0,
  rows: []
})
const columns = [
  {
    title: t('integral.time'),
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: t('integral.type'),
    dataIndex: 'typeName',
    key: 'typeName',
  },
  {
    title: t('integral.change'),
    dataIndex: 'integral',
    key: 'integral',
  }
]

function getTotal() {
  integralTotal().then(r => {
    total.value = r.data
  })
}
function getList() {
  integralBill(page.value).then(r => {
    const {rows} = r
    const ob = {
      1: t('integral.consumption'),
      2: t('integral.reduceOrder'),
      3: t('integral.reset'),
      4: t('integral.orderCancel'),
      5: t('integral.afterSale'),
    }
    rows.forEach(it => {
      it.typeName = ob[it.billType]
    })
    dataObj.value = {
      total: r.total,
      rows: r.rows
    }
  })
}
function onChange(pageNum, pageSize) {
  console.log(pageNum, pageSize, 123)
  page.value = {
    pageNum,
    pageSize
  }
  getList()
}
// 积分规则明细
function ruleInfo() {
  router.push('/integralRule')
}

getTotal()
getList()
</script>

<template>
  <div class="p-integral">
    <div class="head">
      <a-flex justify="space-between" align="center">
        <p class="title">{{ $t('integral.myPoint') }}</p>
        <div class="rule" @click="ruleInfo">
          {{ $t('integral.rule') }}
          <img :src="queIcon"/>
        </div>
      </a-flex>
      <p class="num">
        {{ $t('integral.ablePoint') }}
        <span>{{ total }}</span>
      </p>
    </div>
    <div class="bill">
      <p class="title">{{ $t('integral.detail') }}</p>
      <a-table
        :columns="columns"
        :data-source="dataObj.rows"
        :pagination="false"
        class="mb20"
      />
      <a-pagination
        @change="onChange"
        :total="dataObj.total"
        v-model:current="page.pageNum"
        v-model:pageSize="page.pageSize"
        :hideOnSinglePage="true"
        show-size-changer
        :pageSizeOptions="['10','20','30','40','50']"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-integral {
  .head {
    padding: 16px 24px;
    background: #FAFAFA;
    border-radius: 6px;
    margin-bottom: 32px;
    .title {
      font-size: 16px;
    }
    .rule, .num {
      font-size: 14px;
      color: #939599;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .rule {
      cursor: pointer;
    }
    .num {
      margin-top: 30px;
      span {
        font-weight: 600;
        font-size: 18px;
        color: #262626;
      }
    }
  }
  .bill {
    .title {
      font-size: 20px;
      margin-bottom: 32px;
    }
    .mb20 {
      margin-bottom: 20px;
    }
  }
}
</style>