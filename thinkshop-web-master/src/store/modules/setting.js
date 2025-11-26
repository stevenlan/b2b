import {designConfig, websiteConfig} from '@/api/login'
import { i18n } from '@/locales'
import cache from '@/utils/cache'

const settingStore = defineStore(
  'setting',
  {
    state: () => ({
      design: {},
      global: {}, // 网站配置：语言、货币...
    }),
    actions: {
      getDesignConfig() {
        designConfig().then(r => {
          this.design = r.data
        })
      },
      async setWebsiteConfig() {
        // sys_language 语言
        // sys_currency 货币
        try {
          const {data} = await websiteConfig()
          const lang = data.languageCode || 'en_US'
          this.global = data
          i18n.global.locale.value = lang
          cache.local.set('lang', lang)
          return Promise.resolve(data)
        } catch (error) {
          return Promise.resolve({error: 'err'})
        }
      }
    }
  }
)

export default settingStore