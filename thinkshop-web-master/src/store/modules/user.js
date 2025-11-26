import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/cookie'
import { loseAuth } from '@/utils/auth'
import useCommodityStore from './commodity'


const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      userInfo: {},
    }),
    actions: {
      // 登录
      login(userInfo) {
        const {email, password} = userInfo
        return new Promise((resolve, reject) => {
          login({password, email}).then(res => {
            let data = res.data
            setToken(data.access_token)
            this.token = data.access_token
            useCommodityStore().getCart()
            this.getUserInfo()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 登录状态，获取用户信息
      getUserInfo(open) {
        getInfo(open).then(res => {
          this.userInfo = res.data
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout().then(r => {
            this.token = ''
            this.userInfo = {}
            removeToken()
            useCommodityStore().cartTotal = 0
            loseAuth()
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        })
      }
    }
  })

export default useUserStore
