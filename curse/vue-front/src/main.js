import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
// import App from './App.vue'
import root from './root.vue'
import prolHome from './prol/home.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/prol/home',
            component: prolHome
        }
    ]
})
createApp(root).use(router).mount('#app')
