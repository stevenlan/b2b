<template>
  <div>
      <ul class="r-p h-flex right-nav">
        <li class="nav-item">
          <a-flex style="margin-right: 10px;">
            <Transition name="slide-fade">
              <a-flex v-if="showSearch" class="search" align="center">
                <a-input
                    v-model:value.trim="keyWord"
                    :placeholder="`${$t('common.search')}...`"
                    @pressEnter="search"
                />
              </a-flex>
            </Transition>
            <i :class="['iconfont',  showSearch?'icon-guanbi-1':'icon-sousuo', 'cursor-p']" @click="toRoute({path: '',type:1})"/>
          </a-flex>
          <a-popover placement="bottomRight" :arrow="!!useUser.token">
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
                    v-for="item in centerList"
                    :key="item.type"
                    class="cursor-p"
                    @click="clickCenter(item)"
                >
                  {{it.label}}
                </li>
              </ul>
            </template>
            <i class="iconfont icon-zhucedenglu cursor-p]" @click="clickAvatar"/>
          </a-popover>
          <a-badge :count="useStore.cartTotal" style="margin-left: 10px;line-height: 32px;">
            <i class="iconfont cursor-p icon-gouwudai" @click="toRoute({path: '/center'})"/>
          </a-badge>
        </li>
      </ul>
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
.nav-item{
  display: flex;
  height: 30px;
  line-height: 30px;
}
.h-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.iconfont {
  font-size: 24px;
  color: #fff !important;
}
</style>
