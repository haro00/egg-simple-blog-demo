export default [
    {
        path: '/404',
        component: () => import(/* webpackChunkName: 'modules/status' */ '../modules/status/404'),
        name: 'status404'
    },
    {
        path: '*',
        redirect: '/404'
    }
];
