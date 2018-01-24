export default [
    {
        path: '/admin/article',
        redirect: '/admin/article/p/1',
        name: 'adminArticle',
    },
    {
        path: '/admin/article/p/:page',
        name: 'adminArticleList',
        component: () => import(/* webpackChunkName: 'modules/admin/article' */ '../modules/admin/article/list'),
        props: true
    },
    {
        path: '/admin/article/add',
        name: 'adminArticleAdd',
        component: () => import(/* webpackChunkName: 'modules/admin/article' */ '../modules/admin/article/edit'),
    },
    {
        path: '/admin/article/e/:id',
        name: 'adminArticleEdit',
        component: () => import(/* webpackChunkName: 'modules/admin/article' */ '../modules/admin/article/edit'),
        props: true
    },
];
