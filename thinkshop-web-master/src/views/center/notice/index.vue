<template>
  <div class="p-notice">
    <p class="title"> {{$t('noticeMsg.notification')}}</p>
    <a-flex :gap="32">
      <p
        v-for="it in tabList"
        :key="it.type"
        :class="['tab-item', it.type===tabType?'active':'']"
        @click="changeTab(it.type)"
      >{{ it.label }}</p>
    </a-flex>
    <div class="content" id="noticeLoading" v-if="!loading">
      <div class="con-list" v-for="(it, i) in list" :key="i">
        <a-flex justify="space-between" align="center">
          <div class="l-item">
            <a-flex :gap="20" justify="space-between">
              <p class="con-title">{{ it[tabType==='notice'?'noticeTitle':'title'] }}</p>
              <p class="con-time" v-if="tabType==='notice'">{{ formatDateTime(it.createTime) }}</p>
            </a-flex>
            <p :class="['con-text', it.showMore?'more':'']" @click="it.showMore=!it.showMore">
              {{ it[tabType==='notice'?'noticeContent':'content'] }}
            </p>
          </div>
          <div class="info-text" v-if="tabType==='message'" @click="toOrderDetail(it.orderId)">
            {{$t('noticeMsg.detail')}}
          </div>
        </a-flex>
      </div>
    </div>
    <div class="empty-con" v-if="!loading&&!list.length">
      <img :src="tabType==='notice'?noticeEmpty:msgEmpty"/>
      <p>{{$t(`noticeMsg.no${tabType==='notice'?'Notice':'Msg'}`)}}~</p>
    </div>
  </div>
</template>

<script setup>
import {queryNotice, queryMsg} from '@/api/notice'
import Spin from "@/utils/spin.js";
import {formatDateTime} from '@/utils'
import noticeEmpty from '@/assets/images/empty_notice.png'
import msgEmpty from '@/assets/images/empty_msg.png'
import { useI18n} from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const tabType = ref('notice')
const tabList = shallowRef([
  {label: t('noticeMsg.notice'), type: 'notice'},
  {label: t('noticeMsg.msg'), type: 'message'}
])
const list = ref([])
const loading = ref(false)

function changeTab(type) {
  tabType.value = type
  init()
}
function init() {
  const api = tabType.value === 'notice'?queryNotice:queryMsg
  loading.value = true
  // const spinIntance = Spin.service({target: '#noticeLoading', alignItems: 'center'});
  api().then(r => {
    loading.value = false
    list.value = r.rows
    // spinIntance.close()
  })
  .catch(() => {
    // spinIntance.close()
  })
}
function toOrderDetail(id) {
  router.push(`/order-detail?id=${id}`)
}

init()
</script>

<style scoped lang="scss">
.p-notice {
  color: #262626;
  .title {
    font-size: 20px;
    margin-bottom: 25px;
  }
  .tab-item {
    font-weight: 600;
    font-size: 16px;
    padding-bottom: 9px;
    cursor: pointer;
    margin-bottom: 32px;
    &.active {
      border-bottom: 2px #262626 solid;
    }
  }
  .empty-con {
        text-align: center;
        padding: 100px 0;
        img {
          width: 100px;
          height: 100px;
        }
        p {
          font-size: 14px;
          color: #8C8C8C;
        }
      }
  .content {
    .con-list {
      padding: 16px 24px;
      border: 1px #8C8C8C solid;
      border-radius: 2px;
      margin-bottom: 12px;
      .l-item  {
        flex: 1;
        .con-title {
          font-weight: 600;
          font-size: 16px;
        }
        .con-time {
          font-size: 14px;
          color: #8C8C8C;
        }
        .con-text {
          margin-top: 14px;
          font-size: 14px;
          color: #939599;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* 限制在一个块元素显示的文本的行数 */
          -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
          overflow: hidden;
          text-overflow: ellipsis;
          &.more {
            display: block;
          }
        }
      }
      .info-text  {
        text-decoration-line: underline;
        font-size: 14px;
        width: 80px;
        text-align: right;
        cursor: pointer;
      }
    }
  }
}
</style>