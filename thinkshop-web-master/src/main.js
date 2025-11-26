import { createApp } from 'vue'
import {i18n} from './locales'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/index.scss'
import './permission'

import signAntd from './plugins/antd'
import signVideo from './plugins/video'
import CInput from './components/CInput'

import App from './App.vue'
import router from './router'
import store from './store'


const app = createApp(App)

// 注册全局组件
app.component('CInput', CInput)

// 按需引入antd
signAntd(app)
signVideo(app)

app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
