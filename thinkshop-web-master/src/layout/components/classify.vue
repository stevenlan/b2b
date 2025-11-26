<template>
  <div class="c-classify" @mouseleave="handleMouseleave">
    <div class="main-con w-width">
      <a-tabs v-model:activeKey="activeKey" centered size="large">
        <a-tab-pane v-for="it in tabList" :key="it.categoryId">
          <template #tab>
            <div @mouseenter="handleMouseenter(it)" class="s-tab" @click="toRoute(it)">
              {{it.name}}
            </div>
          </template>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="classify-pop" v-if="popShow">
      <div class="pop" @mouseleave="handleMouseleave">
        <div class="w-width pop-cell">
          <div class="pop-con">
            <a-flex warp="warp" :gap="100" justify="center">
              <div class="c-item-box" v-for="it in child" :key="it.categoryId">
                <p class="cursor-p" @click="toRoute(it)">{{it.name}}</p>
                <ul v-if="it.child&&it.child.length">
                  <li v-for="item in it.child" :key="item.categoryId" class="cursor-p" @click="toRoute(item)">
                    {{item.name}}
                  </li>
                </ul>
              </div>
            </a-flex>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {categoryList} from '@/api/product'

const router = useRouter()
const {proxy} = getCurrentInstance()

const tabList = ref([])
const activeKey = ref('home')
const popShow = ref(false)
const child = ref([])

watch(() => router.currentRoute.value, val => {
  if(val.path==='/index') {
    activeKey.value = 'home'
  }
}, {deep: true})

function handleMouseenter(it) {
  if(it.categoryId!=='home'&&it.child?.length) {
    popShow.value = true
    child.value = it.child
  } else {
    resetPop()
  }
}
// 重置下拉分类状态
function resetPop() {
  popShow.value = false
  child.value = []
}
function handleMouseleave() {
  resetPop()
}
function queryCategory() {
  categoryList().then(res => {
    const {rows} = res
    tabList.value = [
      {
        name: proxy.$t('layout.home'),
        categoryId: 'home'
      },
      ...rows
    ]
  })
}
function toRoute(it) {
  const {categoryId} = it
  let query = {}
  const path = categoryId==='home'?'/index':'/product-list'
  if(categoryId!=='home') query = {categoryId, fullPath: encodeURIComponent(it.path)}
  router.push({path, query})
  resetPop()
}

queryCategory()
</script>

<style lang="scss" scoped>
.c-classify {
  position: relative;
  background: #ffffff;
  &::after {
    content: '';
    position: absolute;
    border-bottom: 1px #E5E5E5 solid;
    right: 0;
    left: 0;
    top: 76px;
  }
  .main-con {
    margin: 0 auto;
    :deep(.ant-tabs) {
      .ant-tabs-nav {
        margin: 0;
        &::before {
          display: none;
        }
      }
      .ant-tabs-tab {
        font-size: 16px;
        padding: 0;
        margin: 0;
        &.ant-tabs-tab-active {
          color: #262626;
          .ant-tabs-tab-btn {
            font-weight: 600;
            color: #262626;
          }
        }
        &:hover {
          .ant-tabs-tab-btn {
            // font-weight: 600;
            color: #262626;
          }
        }
        .s-tab {
          padding-right: 28px;
          height: 76px;
          line-height: 76px;
        }
      }
      .ant-tabs-ink-bar {
        background: #262626;
        &::after {
          content: '';
          display: block;
          width: 32px;
          height: 2px;
          background: #FFFFFF;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
  .classify-pop {
    position: absolute;
    width: 100%;
    height: calc(100vh - 156px);
    background: rgba(0, 0, 0, .5);
    border-top: 1px solid #E5E5E5;
    top: 76px;
    left: 0;
    z-index: 99;
    .pop {
      background: #FFFFFF;
    }
    .pop-cell {
      padding: 24px 0 40px;
      margin: 0 auto;
      .pop-con {
        width: auto;
        margin: 0 auto;
        .c-item-box {
          p {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 20px;
          }
          ul {
            li {
              font-size: 16px;
              margin-bottom: 8px;
              &:hover {
                text-decoration: underline;
                text-underline-position: under;
              }
            }
          }
        }
      }
    }
  }
}
</style>