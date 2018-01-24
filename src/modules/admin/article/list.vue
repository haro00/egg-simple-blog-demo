<template>
    <div class="main admin-wrapper" v-title="'文章管理'">
        <div v-if="!loading">
            <div class="admin-top">
                <router-link :to="{name: 'adminArticleAdd'}" class="btn-default">添加文章</router-link>
                <!--<router-link :to="{name: 'adminArticleRecycle'}" class="btn-default">回收站</router-link>-->
            </div>
            <table-list :thead="thead" :tbody="tbody" class="article-list">
                <div class="td" slot="th-after">文章分类</div>
                <div class="td" slot="th-after">状态</div>
                <div class="td" slot="th-after">操作</div>
                <template slot="td-after" slot-scope="props">
                    <div class="td">
                        <p v-text="changeType(props.item.typeId).toString()"></p>
                    </div>
                    <div class="td">
                        <p v-text="props.item.state == 1 ? '公开' : '不公开'"></p>
                    </div>
                    <div class="td td-opr">
                        <p>
                            <router-link :to="{name: 'articleView', params: {id: props.item.id}}">查看</router-link>
                            <router-link :to="{name: 'adminArticleEdit', params: {id: props.item.id}}">编辑</router-link>
                            <a href="javascript: void(0);" @click="del(props.item.id, props.item.title)">删除</a>
                        </p>
                    </div>
                </template>
            </table-list>
            <pages :total="pageTotal" :page="page"></pages>
        </div>
        <loading v-if="loading"></loading>
    </div>
</template>

<script type="text/babel">

    export default {
        name: 'adminArticleList',
        props: {
            // 当前页
            page: {
                default: 1
            }
        },
        data() {
            return {
                // 表头
                thead: {
                    title: '文章名称',
                    createTime: '创建时间'
                },
                // 列表
                tbody: [],
                pageSize: 20,
                // 总页数
                pageTotal: 0,
                // 加载中
                loading: false,
            }
        },
        computed: {
            user() {
                return this.$store.getters.getUser;
            },
            typeObj() {
                return this.$store.state.typeObj;
            },
        },
        watch: {
            $route: 'getList'
        },
        created() {
            this.getList();
        },
        methods: {
            // 获取列表
            getList() {
                this.loading = true;
                let search = this.$route.query.search;
                this.fetchGraphql({
                    query: `query($data: ArticleListIpt) {
                        articleList(data: $data) {
                            total
                            list{
                                id
                                title
                                creator
                                cover
                                typeId
                                state
                                views
                                createTime
                            }
                        }
                    }`,
                    variables: {
                        data: {
                            search,
                            creatorId: this.user.id,
                            page: Number(this.page),
                            pageSize: this.pageSize
                        }
                    }
                }).then(({status, data: {articleList: {list, total}}}) => {
                    if (status === 200) {
                        this.tbody = list;
                        this.pageTotal = Math.ceil(total / this.pageSize);
                    }
                    this.loading = false;
                }).catch(err => {
                    this.tbody = [];
                    this.pageTotal = 0;
                    this.loading = false;
                });
            },
            // 删除文章
            del(id, title) {
                this.confirm({
                    title: '确认删除',
                    html: `确认删除<span class="color-green">${title}</span>吗？删除后的文章将放在回收站中。`
                }).then(v => {
                    if (v != 1) {
                        return false;
                    }
                    this.fetchGraphql({
                        query: `mutation($data: ArticleUpdateIpt) {
                            article(data: $data) {
                                id
                            }
                        }`,
                        variables: {
                            data: {
                                id,
                                state: -1
                            }
                        }
                    }).then(({status, data}) => {
                        if (status === 200) {
                            this.tip('删除成功', 'success');
                            if (this.page > 1 && this.tbody.length === 1) {
                                let {name, params, query} = this.$route;
                                this.$route.replace({
                                    name,
                                    params: {page: this.page - 1},
                                    query
                                });
                            } else {
                                this.getList();
                            }
                        }
                    }).catch(err => {
                        this.tip('删除失败', 'error');
                    });
                });
            },
            // 将分类id字符串转成分类名
            changeType(ids) {
                if (!ids || !this.typeObj) {
                    return [];
                }
                let arr = ids.split(',');
                return arr.map(id => this.typeObj[id].name);
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "./scss/admin";
</style>

