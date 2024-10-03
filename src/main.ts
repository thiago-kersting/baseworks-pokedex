import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.ts'
import { MotionPlugin } from "@vueuse/motion"

import './assets/index.css'
import i18n from './utils/i18n.ts'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(MotionPlugin)
app.mount('#app')
