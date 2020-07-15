import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history',
    // base: 'admin',
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import( './views/Login') /* 登录 */
        },
        {
            path: '/login',
            name: 'login',
            component: () => import( './views/Login') /* 登录 */
        },
        {
            path: '/401',
            name: '401',
            component: () => import('./401')
        },
        {
            path: '/404',
            name: '404',
            component: () => import('./404')
        }
    ]
})
