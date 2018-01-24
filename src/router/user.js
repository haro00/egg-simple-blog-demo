export default [
    {
        path: '/login',
        component: () => import(/* webpackChunkName: 'modules/user' */ '../modules/login/login.vue'),
        name: 'login'
    },
    {
        path: '/register',
        component: () => import(/* webpackChunkName: 'modules/user' */ '../modules/login/register.vue'),
        name: 'register'
    },
    {
        path: '/user',
        redirect: '/user/page/1',
        name: 'userNav'
    },
    {
        path: '/user/page/:page',
        component: () => import(/* webpackChunkName: 'modules/user' */ '../modules/user/list'),
        name: 'userList'
    },
];
