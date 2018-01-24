<template>
    <div class="vue-select">
        <label class="select-text">
            <input type="text" readonly data-tip="必选" :required="required" :value="selected[text]" :disabled="!!disabled" :data-val="selected[val]" :placeholder="placeholder" @focus="showList" @blur="hideList"/>
            <span class="select-icon"></span>
        </label>
        <transition name="slide">
            <ul :class="['select-list', {'list-top': top || listTop}]" :style="{maxHeight: maxHeight + 'px'}" v-show="show">
                <template v-if="options.length > 0">
                    <li v-for="(opt, index) of options" :class="{selected: opt[val] === selected[val], disabled: opt[text] === placeholder}" :title="opt[text]" v-text="opt[text]" @mousedown="change(index)"></li>
                </template>
                <li v-else class="disabled">暂无数据</li>
            </ul>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'vueSelect',
        props: {
            // 下拉列表项
            options: {
                type: Array,
                required: true
            },
            // 选中的选项
            selected: {
                type: Object,
                required: true
            },
            // 提示信息
            placeholder: {
                type: String,
                default: '请选择'
            },
            // 是否必选
            required: {
                default: false
            },
            // 是否禁用select
            disabled: {
                default: false
            },
            // 选项的val名,传值使用
            val: {
                type: String,
                default: 'val'
            },
            // 选项的text名,显示使用
            text: {
                type: String,
                default: 'text'
            },
            // 是否默认向上展开
            top: {
                default: false
            },
            // 显示下拉列表的条数
            row: {
                default: 5
            }
        },
        data() {
            return {
                // 显示隐藏下拉列表
                show: false,
                // 下拉列表是否向上展开
                listTop: false,
                // 下拉列表的最大高度
                maxHeight: 0
            }
        },
        mounted() {
            let textDom = document.querySelector('.vue-select .select-text');
            let textHeight = textDom.clientHeight;
            this.maxHeight = textHeight * this.row;
        },
        methods: {
            // 显示下拉列表
            showList(event) {
                if (this.options.length < 1) {
                    this.show = true;
                    return false;
                }
                let textDom = event.target.parentNode;
                let listDom = textDom.nextElementSibling;
                let optNum = Math.min(this.row, listDom.children.length);
                let selectTop = textDom.parentNode.getBoundingClientRect().top;
                let textHeight = textDom.clientHeight;
                let allHeight = selectTop + textHeight + optNum * textHeight + 5;
                let winHeight = window.innerHeight;
                this.listTop = selectTop > optNum * textHeight + 5 && allHeight > 0.99 * winHeight;
                this.show = true;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let optHeight = listDom.firstElementChild.clientHeight;
                    let index = this.options.findIndex(item => item[this.val] === this.selected[this.val]);
                    listDom.scrollTop = optHeight * (index - 1);
                }, 10);
            },
            // 隐藏下拉列表
            hideList() {
                this.show = false;
            },
            // 选择一个列表项
            change(index) {
                if (Object.is(this.selected, this.options[index]) || this.options[index][this.text] === this.placeholder) {
                    return false;
                }
                this.$emit('update:selected', this.options[index]);
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import '../../common/scss/base/variables';
    
    $option-height: $ipt-height;
    $option-bg: rgb(250, 255, 250);
    
    .slide-enter-active{
        transform: scaleY(1);
        transition: all .2s ease;
    }
    
    .slide-leave-active{
        transform: scaleY(0);
        transition: all .2s ease;
    }
    
    .slide-enter{
        transform: scaleY(0);
    }
    
    .vue-select{
        position: relative;
        font-size: 12px;
        .select-text{
            position: relative;
            display: block;
            width: 100%;
            height: $option-height;
            border-radius: 2px;
            input[type='text']{
                position: relative;
                z-index: 2;
                width: 100% !important;
                height: $option-height;
                padding-right: 20px;
                border: 1px solid $border-color;
                border-radius: 2px;
                background: transparent;
                box-sizing: border-box;
                text-indent: .5em;
                line-height: normal;
                &:focus{
                    border: 1px solid $green;
                    outline: none;
                    + .select-icon{
                        border-top-color: $green;
                    }
                }
            }
            .select-icon{
                position: absolute;
                right: 6px;
                top: 50%;
                z-index: 2;
                display: block;
                width: 0;
                height: 0;
                margin-top: -3px;
                border-top: 6px solid $border-color;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
            }
        }
        .select-list{
            position: absolute;
            top: $option-height + 5px;
            left: 0;
            z-index: 3;
            width: 100%;
            max-height: $option-height * 5;
            border: 1px solid $border-color;
            border-radius: 2px;
            background: $option-bg;
            overflow: auto;
            transform-origin: top;
            transform-style: preserve-3d;
            perspective-origin: top;
            perspective: 400px;
            box-sizing: border-box;
            &.list-top{
                top: auto;
                bottom: $option-height + 5px;
                transform-origin: bottom;
            }
            li{
                float: none !important;
                width: 100%;
                height: $option-height;
                margin: 0 !important;
                border: 0 !important;
                border-radius: 0 !important;
                text-indent: .5em;
                text-align: left;
                line-height: $option-height;
                color: $content;
                cursor: pointer;
                &:hover{
                    background: darken($option-bg, 5%);
                }
                &.disabled{
                    background: $option-bg;
                    color: $gray;
                    cursor: default;
                }
                &.selected{
                    background: $green;
                    color: #fff;
                }
            }
        }
    }
</style>