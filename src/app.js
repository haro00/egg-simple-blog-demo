import Vue from 'vue';
import VueRouter from 'vue-router';
import plugin from './common/plugin/plugin'
import App from './modules/app.vue'
import routes from './router/index'
import WebStorage from './common/utils/storage'

// 开发选项
if (process.env.NODE_ENV !== 'production') {
    Vue.config.devtools = true;
}

// 使用vue-router
Vue.use(VueRouter);
// 使用自定义插件
Vue.use(plugin);

// 自定义本地存储
window.LocalStorage = new WebStorage();
window.SessionStorage = new WebStorage('sessionStorage');

// 定义路由
const router = new VueRouter({
    mode: 'history',
    routes
});
// 路由跳转到之前
// router.beforeEach((to, from, next) => {
//     document.title = 'BLOG';
//     next();
// });

// 渲染app
const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
