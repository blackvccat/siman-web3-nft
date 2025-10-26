import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化购物车store
import { useCartStore } from './stores/cart'
const cartStore = useCartStore()
cartStore.init()

app.mount('#app')
