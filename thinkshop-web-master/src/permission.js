import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/cookie'
import useSettingStore from '@/store/modules/setting'

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start()
  const useSetting = useSettingStore()
  const routeRule = () => {
    if(getToken() && to.path==='/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  }
  // 判断有无拉取过网站配置信息
  if(Object.getOwnPropertyNames(useSetting.global).length)  {
    routeRule()
  } else {
    useSetting.setWebsiteConfig().then(() => {
      routeRule()
    })
  }
})

router.afterEach(() => {
  NProgress.done()
})
