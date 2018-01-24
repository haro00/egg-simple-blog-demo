<template>
    <div class="main login-wrap" v-title="'登录'">
        <div class="login-form">
            <div class="form-tabs">
                <a href="javascript:void(0);">请登录</a>
            </div>
            <svg class="svg-gradient">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0" spreadMethod="reflect" gradientTransform="rotate(30)">
                        <stop offset="10%" :stop-color="getColor()" stop-opacity="0.9"/>
                        <stop offset="20%" :stop-color="getColor()" stop-opacity="0.8"/>
                        <stop offset="30%" :stop-color="getColor()" stop-opacity="0.6"/>
                        <stop offset="40%" :stop-color="getColor()" stop-opacity="0.8"/>
                        <stop offset="50%" :stop-color="getColor()" stop-opacity="0.9"/>
                        <stop offset="60%" :stop-color="getColor()" stop-opacity="0.8"/>
                        <stop offset="70%" :stop-color="getColor()" stop-opacity="0.6"/>
                        <stop offset="80%" :stop-color="getColor()" stop-opacity="0.8"/>
                        <stop offset="90%" :stop-color="getColor()" stop-opacity="0.9"/>
                    </linearGradient>
                </defs>
            </svg>
            <validate ref="validate">
                <div class="login-item">
                    <label class="input-box">
                        <input :class="['input-effect', {'has-content': username}]" type="text" required odd="true" minLength="4" maxLength="16" v-model="username" @keyup.enter="login">
                        <span class="placeholder">请输入用户名</span>
                        <svg class="input-border">
                            <polygon points="2,2 372,2 372,40 2,40"></polygon>
                        </svg>
                    </label>
                </div>
                <div class="login-item">
                    <label class="input-box">
                        <input :class="['input-effect', {'has-content': password}]" type="password" required v-model="password" @keyup.enter="login">
                        <span class="placeholder">请输入密码</span>
                        <svg class="input-border">
                            <polygon points="2,2 372,2 372,40 2,40"></polygon>
                        </svg>
                    </label>
                </div>
            </validate>
            <div class="login-item">
                <label class="input-checkbox">
                    <input type="checkbox" v-model="remember">
                    <span>记住密码</span>
                </label>
            </div>
            <div class="login-item">
                <input type="button" class="login-btn" @click="login" :disabled="!loginAble" value="登录">
            </div>
            <div class="login-item">
                <a href="javascript:void(0);" class="color-blue forgot-password">忘记密码</a>
                <router-link :to="{name: 'register'}" class="color-blue fr">点击注册</router-link>
            </div>
        </div>
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>

    export default {
        name: 'login',
        data() {
            return {
                username: '',
                password: '',
                remember: false,
                originName: '',
                loginAble: true
            }
        },
        created() {
            LocalStorage.del('user');
        },
        methods: {
            getColor() {
                let i, rgb = [];
                for (i = 0; i < 3; i++) {
                    rgb[i] = Math.floor(Math.random() * 255);
                }
                return 'rgb(' + rgb.join(',') + ')';
            },
            login() {
                if (!this.$refs.validate.validForm()) {
                    return false;
                }
                this.fetchGraphql({
                    query: `query($data: UserLoginIpt) {
                        user: userLogin(data: $data) {
                            id
                            name
                            email
                            roleId
                            token
                        }
                    }`,
                    variables: {
                        data: {
                            name: this.username,
                            password: this.password,
                            save: this.remember
                        }
                    }
                }, true).then(({status, message, data: {user}}) => {
                    if (status !== 200) {
                        return this.tip(message);
                    }
                    if (this.remember) {
                        LocalStorage.set('user', user, {day: 1});
                    } else {
                        LocalStorage.set('user', user, {hour: 6});
                    }
                    this.$store.commit('SET_USER', user);
                    if (this.originName && this.originName !== 'register') {
                        this.$router.go(-1);
                    } else {
                        this.$router.push('/');
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.originName = from.name;
                vm.password = '';
            });
        },
        mounted() {
            LocalStorage.del('token');
        }
    }

</script>

<style lang="scss" type="text/scss">
    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';

    .svg-gradient{
        width: 0;
        height: 0;
    }

    .login-wrap{
        position: relative;
        height: 100%;
        background: $theme;
        overflow: hidden;
        box-sizing: border-box;
        .login-form{
            width: 400px;
            padding: 20px 15px 30px;
            background: #fff;
            box-shadow: 0 0 5px #ccc;
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 2;
            transform: translate(-50%, -50%);
            box-sizing: border-box;
            .form-tabs{
                display: flex;
                justify-content: space-between;
                a{
                    display: block;
                    height: 40px;
                    line-height: 40px;
                    flex: 1;
                    text-align: center;
                    color: $content;
                    font-size: 16px;
                    border-bottom: 2px solid $border-color;
                    &.active{
                        border-bottom: 2px solid $theme;
                        color: $theme;
                    }
                }
            }
        }

        .input-box{
            position: relative;
            display: block;
            height: 40px;
            margin: 5px auto;
            .input-effect{
                width: 100%;
                height: 100%;
                text-indent: .5em;
                background: transparent;
                border: 1px solid $border-color;
                box-sizing: border-box;
                transition: all .4s ease;
                &:focus ~{
                    .placeholder{
                        top: 0;
                        z-index: 2;
                        color: $theme;
                        background: #fff;
                    }
                    .input-border{
                        polygon{
                            stroke-dasharray: 847 70;
                        }
                    }
                }
                &.has-content{
                    border-color: $theme;
                    ~{
                        .placeholder{
                            top: 0;
                            z-index: 2;
                            color: $theme;
                            background: #fff;
                        }
                    }
                }
            }
            .input-border{
                position: absolute;
                top: -1px;
                left: -2px;
                width: 374px;
                height: 42px;
                polygon{
                    fill: none;
                    stroke: url('#gradient');
                    stroke-width: 2px;
                    stroke-dasharray: 840 840;
                    stroke-dashoffset: 840;
                    transition: all .4s ease;
                }
            }
            .placeholder{
                position: absolute;
                top: 50%;
                left: .5em;
                z-index: -1;
                display: inline-block;
                transform: translateY(-50%);
                color: $gray-light;
                transition: all .4s ease;

            }
        }

        .login-item{
            margin: 20px auto;
            .login-btn{
                @include button(
                    $width: 100%,
                    $height: 40px,
                    $bgcolor: $theme,
                    $font-color: #fff,
                    $font-size: 16
                );
                max-width: 100%;
                letter-spacing: 1em;
                text-indent: 1em;
                transition: all .2s ease;
                &[disabled]{
                    background: $disabled !important;
                }
            }
        }
    }
</style>