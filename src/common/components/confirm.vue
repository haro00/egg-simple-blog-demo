<template>
    <div class="confirm-wrap">
        <div class="confirm confirm-in">
            <a href="javascript: void(0);" class="confirm-close" @click="handleClick"></a>
            <h4 class="confirm-title" v-text="title"></h4>
            <div class="confirm-content">
                <i class="confirm-icon"></i>
                <p v-html="html"></p>
            </div>
            <div class="confirm-btn-box">
                <input type="button" class="confirm-btn confirm-btn-default" data-val="1" value="确定" @click="handleClick"/>
                <input type="button" class="confirm-btn confirm-btn-cancel" data-val="0" value="取消" @click="handleClick"/>
            </div>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>

    export default {
        name: 'confirm',
        props: {
            title: {
                default: ''
            },
            html: {
                default: ''
            }
        },
        methods: {
            handleClick(e){
                let confirmDom = this.$el.getElementsByClassName('confirm')[0];
                confirmDom.classList.add('confirm-out');
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    document.body.removeChild(this.$el);
                    if(e.target.dataset){
                        this.$emit('confirm', e.target.dataset.val);
                    }
                }, 400);
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import '../scss/base/variables';
    @import '../scss/base/mixin';

    .confirm-wrap .mask{
        position: fixed;
        top: 0;
        left: 0;
        z-index: $index-confirm - 1;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .4);
    }
    .confirm{
        $title-height: 40px;
    
        width: 400px;
        max-height: 80vh;
        position: fixed;
        top: 40%;
        left: 50%;
        z-index: $index-confirm;
        box-shadow: 0 0 1px #ccc;
        background-color: white;
        border-radius: 4px;
        overflow: hidden;
        font-size: 14px;
        transform: translate(-50%, -50%);
        .confirm-close{
            @include close(18px);
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 2;
        }
        .confirm-title{
            position: relative;
            height: $title-height;
            padding: 0 35px 0 15px;
            background: #fff;
            border-bottom: 1px solid $border-color;
            border-radius: 8px 8px 0 0;
            color: $content;
            line-height: $title-height;
            font-size: 16px;
        }
    
        .confirm-content{
            padding: 15px;
            box-sizing: border-box;
            line-height: 1.5em;
            text-align: center;
            font-size: 16px;
            word-wrap: break-word;
            p{
                text-align: justify;
                display: inline-block;
            }
        }
    
        .confirm-btn-box{
            height: $title-height;
            padding: 0 15px;
            margin-bottom: 10px;
            text-align: center;
            line-height: $title-height;
            .confirm-btn{
                min-width: 80px;
                padding: 5px 8px;
                margin: 0 10px;
                border: 0;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 14px;
                line-height: 1.5em;
                text-align: center;
                cursor: pointer;
            }
            .confirm-btn-default{
                background: $green;
                color: #fff;
            }
            .confirm-btn-cancel{
                background: #fff;
                color: $content;
                border: 1px solid $border-color;
            }
        }
    }
    .confirm-in{
        animation: confirm-in .4s ease;
    }
    
    @keyframes confirm-in{
        0%{
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        70%{
            transform: translate(-50%, 0);
            opacity: .6;
        }
        100%{
            transform: translate(-50%, -50%);
            opacity: 1;
        }
    }
    
    .confirm-out{
        animation: confirm-out .4s ease;
    }
    
    @keyframes confirm-out{
        0%{
            transform: translate(-50%, -50%);
            opacity: 1;
        }
        50%{
            transform: translate(-50%, -100%);
            opacity: .6;
        }
        100%{
            transform: translate(-50%, 150%);
            opacity: 0;
        }
    }
</style>