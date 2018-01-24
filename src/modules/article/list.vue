<template>
    <div class="blog-article" v-title="'文章列表'">
        <transition name="fade" mode="out-in">
            <div v-if="!loading">
                <template v-if="list.length > 0">
                    <article class="article-info" v-for="(article, index) in list" :data-index="index"
                             :key="index">
                        <h4 class="article-title">
                            <router-link class="title-name" v-text="article.title" :to="{name: 'articleView', params: {id: article.id}}"></router-link>
                            <svg class="title-line">
                                <line class="top" x1="0" y1="1" x2="100%" y2="1"></line>
                                <line class="bottom" x1="0" y1="2" x2="100%" y2="2"></line>
                            </svg>
                        </h4>
                        <div class="article-msg">
                            <p class="article-time" v-text="`发表于${getTimeFormat(article.createTime)}(${article.createTime.split(' ')[0]})`"></p>
                            <p class="article-author">
                                <i class="author-icon"></i>
                                <span v-text="article.creator"></span>
                            </p>
                        </div>
                        <div class="article-content">
                            <p v-text="article.intro"></p>
                            <svg class="title-line">
                                <line class="top" x1="0" y1="1" x2="100%" y2="1"></line>
                                <line class="bottom" x1="0" y1="2" x2="100%" y2="2"></line>
                            </svg>
                        </div>
                        <div class="article-tag-list">
                            <router-link class="article-tag" v-for="item of changeType(article.typeId)" :key="item.id" v-text="item.name" :to="{name: 'articleTypeList', params: {page: 1, type: item.id}}"></router-link>
                        </div>
                    </article>
                </template>
                <p class="list-no" v-if="list.length <= 0">暂无相应列表</p>
                <pages :total="pageTotal" :page="page"></pages>
            </div>
        </transition>
        <loading v-if="loading"></loading>
    </div>
</template>

<script type="text/babel">

    export default {
        name: 'articleList',
        props: {
            page: {
                default: 1
            },
            // 文章分类
            type: {
                default: ''
            },
            // 文章日期
            date: {
                default: ''
            },
        },
        data() {
            return {
                list: [],
                pageSize: 10,
                pageTotal: 0,
                loading: false,
            }
        },
        computed: {
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
                let type = parseInt(this.type);
                this.fetchGraphql({
                    query: `query($data: ArticleListIpt) {
                        articleList(data: $data) {
                            total
                            list{
                                id
                                title
                                creator
                                content
                                editor
                                cover
                                intro
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
                            typeId: isNaN(type) ? 0 : type,
                            date: this.date,
                            page: Number(this.page),
                            pageSize: this.pageSize
                        }
                    }
                }, true).then(async ({status, data: {articleList: {list, total}}}) => {
                    if (status === 200) {
                        this.list = list;
                        this.pageTotal = Math.ceil(total / this.pageSize);
                        await this.db.addStore('article', {
                            id: true,
                            creator: false
                        });
                        await this.db.set('article', list, 'id');
                    }
                    this.loading = false;
                }).catch(err => {
                    this.list = [];
                    this.pageTotal = 0;
                    this.loading = false;
                });
            },
            // 将分类id字符串转成分类id和名的数组
            changeType(ids) {
                if (!ids || !this.typeObj) {
                    return [];
                }
                let arr = ids.split(',');
                return arr.map(id => this.typeObj[id]);
            }
        }
    }
</script>