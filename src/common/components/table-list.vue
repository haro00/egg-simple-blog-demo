<template>
    <div class="table-box">
        <div class="table-flex table-list">
            <div class="thead">
                <slot name="th-before"></slot>
                <div class="td" v-for="th in thead" v-text="th"></div>
                <slot name="th-after"></slot>
            </div>
            <template v-if="tbody.length > 0">
                <div class="tr" v-for="(tr, index) of tbody">
                    <slot name="td-before" :item="tr" :index="index"></slot>
                    <div class="td" v-for="(td, key) in thead">
                        <p :title="filterFalse(tr[key])" v-text="filterFalse(tr[key])"></p>
                    </div>
                    <slot name="td-after" :item="tr" :index="index"></slot>
                </div>
            </template>
            <div class="data-none" v-if="tbody.length <= 0 && !loading">
                <p class="none-icon"></p>
                <p class="none-text">暂无更多数据</p>
            </div>
        </div>
        <transition name="opacity">
            <loading v-if="loading"></loading>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'tableList',
        props: {
            // 表头,不包含选择按钮和操作按钮列, key值请使用传入tbody中每个对象的key
            thead: {
                type: Object,
                default() {
                    return {};
                }
            },
            // 表格内容,不包含选择按钮和操作按钮列
            tbody: {
                type: Array,
                default() {
                    return [];
                }
            },
            // 是否显示加载中
            loading: {
                default: false
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';
    
    .table-flex{
        .tr, .thead{
            display: flex;
            width: 100%;
        }
        .thead{
            font-weight: bold;
        }
        .td{
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1 0 0;
            min-height: 36px;
            padding: 5px 8px;
            box-sizing: border-box;
            line-height: 1.2em;
            p{
                text-align: justify;
                display: inline-block;
            }
        }
    }
    
    .table-box{
        overflow: auto;
        box-sizing: border-box;
        .table-list{
            .thead{
                background: $bg-color;
                border-top: 1px solid $border-color;
                border-bottom: 1px solid $border-color;
                .td{
                    padding: 8px;
                    &:not(:first-child){
                        border-left: 1px solid $border-color;
                    }
                }
            }
            .tr{
                &:nth-child(2n + 1){
                    background: $bg-gray;
                }
                &:nth-child(2n){
                    background: #fff;
                }
                &:hover{
                    background: $bg-blue;
                }
            }
            .td-opr{
                a{
                    margin-right: 5px;
                    color: $theme;
                }
            }
        }
        .data-none{
            padding: 60px 0;
            border-bottom: 1px solid $border-color;
            overflow: hidden;
            text-align: center;
            .none-icon{
                height: 160px;
                margin: 10px auto;
                @include background('../images/nodata.png');
            }
            .none-text{
                font-size: 16px;
            }
        }
    }
</style>