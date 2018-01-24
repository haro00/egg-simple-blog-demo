<template>
    <div :class="['tip', 'tip-in', {['tip-' + type]: type}]">
        <a href="javascript: void(0);" class="tip-close" @click="close"></a>
        <i class="tip-icon"></i>
        <div class="tip-content" v-text="text"></div>
    </div>
</template>

<script>

    export default {
        name: 'tip',
        props: {
            type: {
                default: 'warn'
            },
            text: {
                default: ''
            }
        },
        mounted(){
            let timer = setTimeout(() => {
                clearTimeout(timer);
                this.close();
            }, 2000);
        },
        methods: {
            close(){
                this.$el.classList.add('tip-out');
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    document.body.removeChild(this.$el);
                }, 400);
            }
        },
    }
</script>

<style lang="scss" type="text/scss">
    @import '../scss/base/variables';
    @import '../scss/base/mixin';

    .tip{
        position: fixed;
        z-index: 22;
        top: 40vh;
        left: 50%;
        max-width: 50%;
        padding: 20px;
        background: rgba(100, 100, 100, .9);
        border-radius: 4px;
        color: #fff;
        text-align: center;
        transform: translate(-50%, -50%);
    
        &.tip-success{
            padding-left: 40px;
            .tip-icon{
                left: 10px;
                width: 20px;
                height: 20px;
                border: 2px solid $green;
                border-radius: 50%;
                transform: rotateZ(-45deg);
                box-sizing: border-box;
                &:before{
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    display: block;
                    width: 2px;
                    height: 6px;
                    background: $green;
                    border-radius: 1px;
                }
                &:after{
                    content: '';
                    position: absolute;
                    top: 9px;
                    left: 4px;
                    display: block;
                    width: 10px;
                    height: 2px;
                    background: $green;
                    border-radius: 1px;
                }
            }
        }
        &.tip-warn{
            padding-left: 40px;
            .tip-icon{
                @include warn(
                        $width: 20px,
                        $circle-bg: $red,
                        $margin: 4px
                );
                position: absolute;
                left: 10px;
            }
        }
        &.tip-error{
            padding-left: 40px;
            .tip-icon{
                @include close(
                        $width: 20px,
                        $circle-bg: $red,
                        $margin: 4px
                );
                position: absolute;
                left: 10px;
            }
        }
    
        .tip-close{
            @include close(
                    $width: 12px,
                    $line-bg: #fff
            );
            position: absolute;
            top: 4px;
            right: 4px;
            z-index: 2;
        }
        .tip-icon{
            position: absolute;
            top: 20px;
            left: 0;
            display: block;
        }
        .tip-content{
            display: inline-block;
            text-align: justify;
        }
    }
    .tip-in{
        animation: tip-in .4s ease;
    }

    @keyframes tip-in{
        0%{
            transform: translate(-50%, -30vh);
            opacity: 0;
        }
        70%{
            transform: translate(-50%, 20vh);
            opacity: .6;
        }
        100%{
            transform: translate(-50%, -50%);
            opacity: 1;
        }
    }

    .tip-out{
        animation: tip-out .4s ease;
    }

    @keyframes tip-out{
        0%{
            transform: translate(-50%, -50%);
            opacity: 1;
        }
        50%{
            transform: translate(-50%, -10vh);
            opacity: .6;
        }
        100%{
            transform: translate(-50%, 40vh);
            opacity: 0;
        }
    }
</style>