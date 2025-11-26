<template>
  <div class="c-header">
    <div class="w-width main-con h-flex">
      <img class="logo cursor-p" :src="useSetting.design.pageTopUrl || logo" @click="toRoute({path: '/index'})"/>
      <ul class="r-p h-flex right-nav">
        <li v-for="it in iconList" :key="it.type" class="nav-item">
          <a-badge :count="useStore.cartTotal" v-if="it.type===4">
            <i :class="['iconfont', it.icon, 'cursor-p']" @click="toRoute(it)"/>
          </a-badge>
          <a-popover v-else-if="it.type===3" title="" placement="bottomRight" :arrow="!!useUser.token">
            <template #content v-if="!!useUser.token">
              <ul class="center-cell">
                <li>
                  <a-flex justify="space-between" align="center">
                    <div class="user-img">
                      <img :src="avatar"/>
                      <span>{{useUser.userInfo.firstName || ''}}{{useUser.userInfo.lastName || ''}}</span>
                    </div>
                    <img class="exit cursor-p" :src="logout" @click="useUser.logOut()"/>
                  </a-flex>
                </li>
                <li
                  v-for="it in centerList"
                  :key="it.type"
                  class="cursor-p"
                  @click="clickCenter(it)"
                >
                  {{it.label}}
                </li>
              </ul>
            </template>
              <i :class="['iconfont', it.icon, 'cursor-p']" @click="clickAvatar"/>
          </a-popover>
          <div v-else>
            <a-flex align="center">
              <Transition name="slide-fade">
                <a-flex v-if="it.type===1&&showSearch" class="search" align="center">
                  <i class="iconfont icon-sousuo" @click="search"/>
                  <a-input
                    v-model:value.trim="keyWord"
                    :placeholder="`${$t('common.search')}...`"
                    @pressEnter="search"
                  />
                </a-flex>
              </Transition>
              <i :class="['iconfont',  it.type===1&&showSearch?'icon-guanbi-1':it.icon, 'cursor-p']" @click="toRoute(it)"/>
            </a-flex>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import useCommodityStore from '@/store/modules/commodity'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting'
import { setToken } from '@/utils/cookie'
import logo from '@/assets/images/common/logo.png'
import logout from '@/assets/images/logout.png'
import avatar from '@/assets/images/avatar.png'
import {loseAuth} from '@/utils/auth'

const {proxy} = getCurrentInstance()
const router = useRouter()
const useUser = useUserStore()
const useStore = useCommodityStore()
const useSetting = useSettingStore()

const iconList = ref([
  {icon: 'icon-sousuo', type: 1},
  {icon: 'icon-kefu', type: 2, path: ''},
  {icon: 'icon-zhucedenglu', type: 3, path: '/center'},
  {icon: 'icon-gouwudai', type: 4, path: '/cart'}
])
const centerList = shallowRef([
  {label: proxy.$t('layout.accout'), type: 1, path: '/account'},
  {label: proxy.$t('layout.myOrder'), type: 2, path: '/order'},
])
const showSearch = ref(false)
const keyWord = ref('')

function toRoute(o) {
  const {path='', type=''} = o
  if(type===1) {
    showSearch.value = !showSearch.value
  }
  if(type===2) window.open(useSetting.design.customerServiceUrl)
  if(path) router.push(path);
}
// 个人中心
function clickCenter(it) {
  if(it.path) {
    router.push(it.path)
  }
}
function clickAvatar() {
  if(!useUser.token && router.currentRoute.value.path!=='/login')  {
    loseAuth()
  }
  if(useUser.token) router.push('/account')
}
function closeSearch() {
  showSearch.value = false
  keyWord.value = ''
}
function search() {
  const key = keyWord.value
  if(key) router.push({path: '/search', query: {key: encodeURIComponent(key)}})
}
// 免登陆
function init() {
  const {search, origin, hash, pathname} = window.location
  const param = search.split("?")[1]
  let query = {}
  if(param) {
    const t = param.split('&')
    t.forEach((it) => {
        let j = it.split("=");
        query[j[0]] = j[1]
    })
  }
  const {access_token=''} = query
  if(access_token) {
    setToken(access_token)
    window.location.href = `${origin}${pathname}${hash}`
  }
  // 拉取购物车
  useStore.getCart(!access_token)
  // 拉取个人信息
  useUser.getUserInfo(!access_token)
  // 拉取header、footer配置
  useSetting.getDesignConfig()
}

init()



</script>

<style scoped lang="scss">
.c-header {
  border-bottom: 1px #E5E5E5 solid;
  background: #ffffff;
  .h-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .main-con {
    margin: 0 auto;
    height: 72px;
    .logo {
      width: 77px;
      height: 20px;
    }
    .right-nav {
      margin-bottom: 0;
      .nav-item {
        padding-left: 16px;
        .iconfont {
          font-size: 22px;
        }

        .search {
          :deep(.ant-input) {
            width: 400px;
            border: none;
            border-bottom: 1px #262626 solid;
            border-radius: 0;
            &:hover,  &:focus, &:focus-visible {
              border: none;
              border-bottom: 1px #262626 solid;
              border-radius: 0;
              outline: none;
              box-shadow: none;
            }
          }
        }
      }
    }
  }
}

.center-cell {
  li {
    padding: 12px 24px;
    font-size: 14px;
    width: 200px;
    box-sizing: border-box;
    &:first-child {
      padding: 16px 24px;
      .user-img {
        flex: 1;
        img {
          height: 32px;
          width: 32px;
        }
        span {
          display: inline-block;
          word-break: break-word;
          width: calc(100% - 32px);
          vertical-align: middle;
          padding-left: 8px;
          box-sizing: border-box;
        }
      }
      .exit {
        height: 24px;
        width: 24px;
      }
    }
    &:nth-child(2) {
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        height: 1px;
        background: rgba(38,38,38,0.05);
        width: calc(100% - 48px);
        left: 24px;
        top: 0;
      }
    }
    &:nth-child(n + 2) {
      &:hover {
        background: rgba(38,38,38,0.05);
        &::before {
          display: none;
        }
      }
    }
  }
}

/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  // transform: translateY(10px);
}
.item-fade-enter-active {
  transition: all 1s ease-out;
}
</style>