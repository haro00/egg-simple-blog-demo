import user from './user'
import article from './article'
import admin from './admin'
import status from './status'

export default [
    {
        path: '/',
        // component: () => import(/* webpackChunkName: 'modules/index' */ '../modules/home/index'),
        redirect: '/article',
        name: 'index'
    },
    ...article,
    ...user,
    ...admin,
    //404页面, 必须放到最后
    ...status
];