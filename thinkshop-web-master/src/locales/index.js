import {createI18n} from 'vue-i18n'
import cache from '../utils/cache'
import en from './en'
import cn from './cn'

const getLanguage = () => {
  return cache.local.get('lang') || 'zh_CN'
}

const i18n = createI18n({
  legacy: false, // 使用composition API
  locale: getLanguage(),
  globalInjection: true, // 表明使用全局t函数
  messages: {
    en_US: en,
    zh_CN: cn,
    zh_TW: cn
  }
})

export {i18n}