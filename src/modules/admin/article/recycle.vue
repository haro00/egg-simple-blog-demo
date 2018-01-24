<template>
    <div class="main admin-wrapper" v-title="'回收站'">
        <loading v-if="loading"></loading>
    </div>
</template>

<script type="text/babel">
    import {reqArticleListByAuthor, delArticleCompletely, recoverArticle} from './api'
    import Pages from '../../../common/components/pages.vue'

    export default {
        name: 'articleList',
        props: {
            // 当前页
            page: {
                type: [String, Number],
                default: 1
            }
        },
        data() {
            return {
                thead: {
                    title: '文章名称',
                    type: '文章类型',
                    time: '创建时间'
                },
                // 文章列表
                articles: [],
                // 总页数
                pageTotal: 0,
                pageSize: 20,
                // 加载中
                loading: false
            }
        },
        computed: {
            // 作者
            user() {
                return this.$store.getters.getUser;
            }
        },
        watch: {
            $route: 'getArticleList'
        },
        created() {
            this.getArticleList();
        },
        methods: {
            // 获取文章列表
            getArticleList() {
                this.loading = false;
            },
            // 删除文章
            deleteArticle(id, title) {
                this.confirm({
                    title: '彻底删除',
                    html: `删除<span class="color-green">${title}</span>，后将无法恢复，确定要彻底删除吗？`
                }).then(v => {
                    if (v == 1) {
                        this.tip('彻底删除文章成功', 'success');
                        // this.getArticleList();
                    }
                });
            },
            // 恢复文章
            recoverArticle(id) {
                this.tip('恢复文章成功', 'success');
                // this.getArticleList();
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "./scss/admin";
</style>

