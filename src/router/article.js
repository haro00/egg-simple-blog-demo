export default [
    {
        path: '/article',
        redirect: '/article/p/1',
        name: 'articleNav',
        component: () => import(/* webpackChunkName: 'modules/article' */ '../modules/article/index'),
        children: [
            {
                path: 'p/:page',
                component: () => import(/* webpackChunkName: 'modules/article' */ '../modules/article/list'),
                name: 'articleList',
                props: true
            },
            {
                path: 'd/:date/p/:page',
                component: () => import(/* webpackChunkName: 'modules/article' */ '../modules/article/list'),
                name: 'articleDateList',
                props: true
            },
            {
                path: 't/:type/p/:page',
                component: () => import(/* webpackChunkName: 'modules/article' */ '../modules/article/list'),
                name: 'articleTypeList',
                props: true
            },
            {
                path: 'v/:id',
                component: () => import(/* webpackChunkName: 'modules/article' */ '../modules/article/view'),
                name: 'articleView',
                props: true
            },
        ]
    },
];
