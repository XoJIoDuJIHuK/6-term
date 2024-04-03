import Vue from 'vue'
import Router from 'vue-router'
import rootPage from './root.vue'
import prolHome from './prol/home.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Root',
            component: rootPage
        },
        {
            path: '/home',
            name: 'Home',
            component: prolHome
        }
    ]
})

export default router
