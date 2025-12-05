<template>
  <div class="c-header">
    <div class="c-warin">{{$t('layout.nicotineWarning')}}</div>
    <div class="w-width main-con h-flex" style="justify-content: center;">
      <img class="logo cursor-p" :src="useSetting.design.pageTopUrl || logo" @click="toRoute({path: '/index'})"/>
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
  .c-warin{
    background-color: #FFBD44;
    width: 100vw;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .h-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .main-con {
    margin: 10px auto;
    height: 79px;
    .logo {
      width: 86px;
      height: 79px;
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
