<template>
    <div class="pages-box" v-if="pageTotal > 0">
        <ul class="pages">
            <li class="pages-prev">
                <span :disabled="now == 1" @click="prevClick"></span>
            </li>
            <!--如果只有一页就不显示固定的第一个分页按钮了,避免重复-->
            <template v-if="pageTotal > 1">
                <li v-for="i in pageBegin" class="pages-li">
                    <span :disabled="i == now" @click="pageClick(i)" v-text="i"></span>
                </li>
            </template>
            <li v-if="ellipsis[0] > slider">
                <span>...</span>
            </li>
            <li v-for="i in pageMiddle" class="pages-li">
                <span :disabled="i == now" @click="pageClick(i)" v-text="i"></span>
            </li>
            <li v-if="pageTotal - ellipsis[1] > slider">
                <span>...</span>
            </li>
            <li v-for="i in pageEnd" class="pages-li">
                <span :disabled="i == now" @click="pageClick(i)" v-text="i"></span>
            </li>
            
            <li class="pages-next">
                <span :disabled="now == pageTotal" @click="nextClick"></span>
            </li>
            <li class="pages-num">
                <div class="num-input" contenteditable="true" @input="pageInput" @keyup.enter="goClick"></div>
            </li>
            <li class="pages-go">
                <span :disabled="now == pageNum || (now == pageTotal && pageNum >= pageTotal) || (now == 1 && pageNum <= 1)" @click="goClick">GO</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'pages',
        props: {
            // 总页数
            total: {
                type: [Number, String],
                required: true
            },
            // 当前页
            page: {
                type: [Number, String],
                default: 1
            },
            // 点击页码的触发方式, 为'page'时将当前页返回,其余直接跳转页面
            target: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                // 当前页
                now: this.page,
                // 总页数
                pageTotal: this.total,
                // 输入的页码
                pageNum: '',
                // 显示分页按钮的个数
                length: 8,
                // 前后固定的分页按钮个数
                slider: 1
            }
        },
        watch: {
            total(val) {
                if (this.pageTotal == val) {
                    return false;
                }
                let page_total = parseInt(val);
                page_total = (isNaN(page_total) || page_total < 1) ? 1 : page_total;
                this.pageTotal = page_total;
            },
            now(val) {
                if (this.now == val) {
                    return false;
                }
                let page_now = parseInt(val);
                page_now = (isNaN(page_now) || this.pageTotal < 2 || page_now < 1) ? 1 : page_now;
                page_now = page_now > this.pageTotal ? this.pageTotal : page_now;
                this.now = page_now;
            }
        },
        computed: {
            // 前边显示固定分页数
            pageBegin() {
                return Math.min(this.slider, this.ellipsis[0]);
            },
            // 中间显示分页数
            pageMiddle() {
                let arr = [];
                for (let i = this.ellipsis[0] + 1; i <= this.ellipsis[1]; i++) {
                    arr.push(i);
                }
                return arr;
            },
            // 后边显示分页数
            pageEnd() {
                let arr = [];
                for (let i = this.ellipsis[2] + 1; i <= this.pageTotal; i++) {
                    arr.push(i);
                }
                return arr;
            },
            /**
             * 出现三个点时的分页的范围
             * @returns {*[]}
             * begin: 开始页码
             * end: 结束页码
             * end_max: 结束页码的最大值
             */
            ellipsis() {
                let end_max = this.pageTotal - this.slider;
                let begin = this.now - (this.length / 2) + this.slider;
                begin = begin < 1 ? 1 : begin;
                let end = begin + this.length - 2 * this.slider;
                //当begin达到最小值后需要根据begin重新计算end以保证显示的分页按钮个数不变
                end = begin < this.slider ? (end + this.slider - begin) : end;
                if (end >= end_max) {
                    end = end_max;
                    //当end达到最大值后需要根据end重新计算begin以保证显示的分页按钮个数不变
                    begin = (end - this.length + 2 * this.slider) < 1 ? 1 : (end - this.length + 2 * this.slider);
                }
                return [begin, end, end_max];
            }
        },
        methods: {
            // 页面改变跳转链接
            goUrl() {
                if (this.target === 'page') {
                    return this.$emit('update:page', this.now);
                }
                let {name, params, query} = this.$route;
                this.$router.push({
                    name,
                    query,
                    params: {
                        ...params,
                        page: this.now
                    }
                });
            },
            // 上一页
            prevClick() {
                if (this.now <= 1) {
                    return false;
                }
                this.now--;
                this.goUrl();
            },
            // 下一页
            nextClick() {
                if (this.now >= this.pageTotal) {
                    return false;
                }
                this.now++;
                this.goUrl();
            },
            // 点击页码
            pageClick(page) {
                if (this.now === page) {
                    return false;
                }
                this.now = page;
                this.goUrl();
            },
            // 输入页码
            pageInput(e) {
                let num = parseInt(e.target.innerText);
                if (isNaN(num)) {
                    this.pageNum = '';
                    e.target.innerText = '';
                } else {
                    this.pageNum = num;
                    //e.target.innerText = num;
                }
            },
            // 跳转到输入的页码
            goClick() {
                if (this.now === this.pageNum || (this.now === this.pageTotal && this.pageNum >= this.pageTotal) || (this.now === 1 && this.pageNum <= 1)) {
                    return false;
                }
                this.pageNum = this.pageNum < 1 ? 1 : this.pageNum;
                this.pageNum = this.pageNum > this.pageTotal ? this.pageTotal : this.pageNum;
                this.now = this.pageNum;
                this.pageNum = '';
                this.goUrl();
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
    @import '../scss/base/variables';
    
    .pages-box{
        padding: 5px 10px;
        &:after{
            content: '';
            display: table;
            clear: both;
        }
    }
    
    .pages{
        float: right;
        padding: 10px 0;
        &:after{
            content: '';
            display: table;
            line-height: 0;
            clear: both;
        }
        li{
            float: left;
            height: 20px;
            margin: 0 2px;
            line-height: 20px;
            text-align: center;
            box-sizing: border-box;
            span{
                display: block;
                width: 100%;
                height: 100%;
                padding: 0 2px;
                box-sizing: border-box;
                cursor: pointer;
                &[disabled]{
                    cursor: default;
                }
            }
        }
        .pages-li{
            min-width: 30px;
            span{
                border: 1px solid $theme;
                color: $theme;
                &[disabled]{
                    background: $theme;
                    color: #fff;
                }
            }
        }
        .pages-prev, .pages-next{
            width: 30px;
            padding: 0 5px;
            span{
                position: relative;
                display: block;
                height: 100%;
                width: 100%;
                &:before, &:after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    display: block;
                    width: 0;
                    height: 0;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    transform: translateY(-50%);
                }
            }
        }
        .pages-prev span{
            &:before{
                right: 0;
                border-right: 16px solid $theme;
            }
            &:after{
                right: 0;
                z-index: 2;
                border-right: 4px solid #fff;
            }
            &[disabled]{
                &:before{
                    right: 0;
                    border-right: 16px solid gray;
                }
                &:after{
                    right: 0;
                    z-index: 2;
                    border-right: 4px solid #fff;
                }
            }
        }
        .pages-next span{
            &:before{
                left: 0;
                border-left: 16px solid $theme;
            }
            &:after{
                left: 0;
                z-index: 2;
                border-left: 4px solid #fff;
            }
            &[disabled]{
                &:before{
                    left: 0;
                    border-left: 16px solid gray;
                }
                &:after{
                    left: 0;
                    z-index: 2;
                    border-left: 4px solid #fff;
                }
            }
        }
        .pages-num{
            .num-input{
                min-width: 20px;
                height: 20px;
                padding: 0 5px;
                border-radius: 2px;
                border: 1px solid $theme;
                color: $theme;
                text-align: center;
                line-height: 20px;
                outline: none;
            }
        }
        .pages-go{
            span{
                color: $theme;
                &[disabled]{
                    color: #666;
                }
            }
        }
    }
</style>
