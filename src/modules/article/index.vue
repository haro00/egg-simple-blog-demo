<template>
    <div class="main article-wrap">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <aside class="article-aside">
            <h4>文章归档</h4>
            <div class="date-list">
                <router-link v-for="item of dateList" :key="item.date" :to="{name: 'articleDateList', params: {page: 1, date: changeDate(item.date)}}" v-text="`${item.date}(${item.total})`"></router-link>
            </div>
            <h4>文章分类</h4>
            <div class="date-list">
                <router-link v-for="item in typeObj" v-if="item.total > 0" :key="item.id" :to="{name: 'articleTypeList', params: {page: 1, type: item.id}}" v-text="`${item.name}(${item.total})`"></router-link>
            </div>
        </aside>
    </div>
</template>

<script>

    export default {
        name: 'articleWrap',
        data() {
            return {
                // 所有文章创建日期
                dateList: [],
                // EventSource
                source: null,
            }
        },
        computed: {
            // 日历所有文章创建日期
            createDate() {
                let arr = [];
                for (let item of this.dateList) {
                    arr.push(item.date);
                }
                return arr;
            },
            // 分类对象
            typeObj() {
                return this.$store.state.typeObj;
            }
        },
        created() {
            this.getData();
        },
        mounted(){
            this.socket.on('updateArticle', data => {
                this.notice(data);
            });
        },
        methods: {
            // 获取所有创建日期
            getData() {
                this.fetchGraphql({
                    query: `{
                        createDate {
                            date
                            total
                        }
                    }`
                }, true).then(({status, data: {createDate}}) => {
                    if (status === 200) {
                        this.dateList = createDate;
                    }
                }).catch(err => {
                    console.error(err);
                    this.dateList = [];
                });
            },
            changeDate(date) {
                if (/月/.test(date)) {
                    return date.replace(/年/, '-').replace(/月/, '');
                }
                return date.replace(/年/, '');
            },
            // 文章修改通知
            notice(data) {
                let vm = this;
                let {creator, title, time, id, edit} = data;
                if (window.Notification) {
                    (function popNotice() {
                        if (Notification.permission === 'granted') {
                            let notification = edit ? new Notification('文章修改通知：', {
                                body: `${creator}已于${time}修改文章《${title}》，点击查看该文章。`,
                                icon: '../layout/header/logo.png'
                            }) : new Notification('文章添加通知：', {
                                body: `${creator}已于${time}添加文章《${title}》。`,
                                icon: '../layout/header/logo.png'
                            });
                            notification.onclick = function () {
                                vm.$router.push({
                                    name: 'articleView',
                                    params: {id}
                                });
                                notification.close();
                            };
                        } else if (Notification.permission === 'denied') {
                            vm.tip(`${creator}已于${time}${edit ? '修改' : '添加'}文章《${title}》`, 'success');
                        } else {
                            Notification.requestPermission().then(permission => {
                                popNotice();
                            });
                        }
                    })();
                } else {
                    this.tip(`${creator}已于${time}${edit ? '修改' : '添加'}文章《${title}》`, 'success');
                }
            }
        },
    }

</script>

<style lang="scss" type="text/scss">
    @import "../../common/scss/base/variables";
    @import "../../common/scss/base/mixin";

    .article-wrap{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        .blog-article{
            flex: 1;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
            .article-info{
                width: 100%;
                margin-bottom: 20px;
                background: $bg-gray;
                border-radius: 8px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, .4);
                transform-origin: top;
                transition: all .4s ease;
            }
            .title-line{
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 4px;
                line{
                    fill: none;
                    stroke-width: 1px;
                    stroke-dasharray: 10 5;
                    stroke-linecap: round;
                    &.top{
                        stroke: #ddd;
                    }
                    &.bottom{
                        stroke: #fff;
                    }
                }
            }
            .article-title{
                position: relative;
                height: 54px;
                padding: 0 20px;
                line-height: 54px;
                .title-name{
                    @include fontSize(20);
                    font-weight: bold;
                    color: $theme;
                    text-shadow: 1px 1px 0 #ccc, 0 2px 0 #c9c9c9;
                }
            }
            .article-msg{
                display: flex;
                padding: 10px 20px 5px;
                height: 20px;
                line-height: 20px;
                color: $gray;
                > p{
                    padding-right: 15px;
                }
                .article-type{
                    position: relative;
                    padding-left: 22px;
                    padding-right: 5px;
                    color: $gray;
                    .type-icon{
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 16px;
                        width: 24px;
                        background: #fff;
                        border-radius: 0 4px 4px 0;
                        text-align: center;
                        line-height: 16px;
                        filter: drop-shadow(0 0 1px $gray);
                        transform: rotateZ(-30deg) scale(0.5);
                        &:before{
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -8px;
                            display: block;
                            width: 0;
                            height: 0;
                            border-right: 8px solid #fff;
                            border-top: 8px solid transparent;
                            border-bottom: 8px solid transparent;
                        }
                        &:after{
                            content: '';
                            position: absolute;
                            top: 6px;
                            left: -4px;
                            display: block;
                            width: 4px;
                            height: 4px;
                            background: $gray;
                            border-radius: 50%;
                        }
                    }
                }
                .article-time{
                    position: relative;
                    padding-left: 16px;
                    &:before{
                        content: '';
                        position: absolute;
                        top: 3px;
                        left: 0;
                        display: block;
                        width: 20px;
                        height: 20px;
                        border: 3px solid $gray;
                        border-radius: 50%;
                        transform: scale(0.5) translate(-50%, -50%);
                    }
                    &:after{
                        content: '';
                        position: absolute;
                        top: 7px;
                        left: 4px;
                        display: block;
                        width: 3px;
                        height: 3px;
                        border-right: 1px solid $gray;
                        border-bottom: 1px solid $gray;
                    }
                }
                .article-author{
                    position: relative;
                    padding-left: 16px;
                    .author-icon{
                        position: absolute;
                        top: 3px;
                        left: 0;
                        display: block;
                        width: 12px;
                        height: 12px;
                        overflow: hidden;
                        &:before{
                            content: '';
                            position: absolute;
                            bottom: -6px;
                            left: 0;
                            display: block;
                            width: 12px;
                            height: 12px;
                            background: $gray;
                            border-radius: 50%;
                        }
                        &:after{
                            content: '';
                            position: absolute;
                            bottom: 4px;
                            left: 2px;
                            display: block;
                            width: 6px;
                            height: 6px;
                            background: $gray;
                            border: 1px solid $bg-gray;
                            border-radius: 50%;
                        }
                    }
                }
            }
            .article-content{
                position: relative;
                padding: 5px 20px 10px;
                line-height: 1.5em;
            }
            .article-tag-list{
                display: flex;
                padding: 10px 20px;
                .article-tag{
                    position: relative;
                    height: 20px;
                    padding: 0 8px 0 6px;
                    margin: 0 10px;
                    background: #fff;
                    border-radius: 0 2px 2px 0;
                    line-height: 20px;
                    color: $content;
                    @include fontSize(12);
                    filter: drop-shadow(0 0 1px $gray);
                    transition: all .2s ease;
                    &:before{
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -10px;
                        display: block;
                        width: 0;
                        height: 0;
                        border-right: 10px solid #fff;
                        border-top: 10px solid transparent;
                        border-bottom: 10px solid transparent;
                        transition: all .2s ease;
                    }
                    &:after{
                        content: '';
                        position: absolute;
                        top: 8px;
                        left: -4px;
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: $gray;
                        border-radius: 50%;
                        transition: all .2s ease;
                    }
                    &:hover{
                        background: #ccc;
                        color: #fff;
                        &:before{
                            border-right-color: #ccc;
                        }
                        &:after{
                            background: #fff;
                        }
                    }
                }
            }
        }
        .article-aside{
            position: relative;
            flex: 0 0 300px;
            padding: 20px;
            background: #fff;
            box-sizing: border-box;
            h4{
                margin-bottom: 8px;
                font-size: 18px;
            }
            .date-list{
                @include clearfix();
                a{
                    float: left;
                    width: 50%;
                    padding: 5px;
                    color: $content;
                    box-sizing: border-box;
                    @include ellipsis();
                    &.router-link-active{
                        color: $blue-light;
                    }
                    &:hover{
                        color: $theme;
                    }
                }
            }
        }
        @media screen and (max-width: 1000px){
            .article-aside{
                display: none;
            }
        }
    }
</style>