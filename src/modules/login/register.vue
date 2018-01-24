<template>
    <div class="main login-wrap" v-title="'注册'">
        <div class="login-form">
            <div class="form-tabs">
                <a href="javascript:void(0);">请注册</a>
            </div>
            <validate ref="validate">
                <div class="login-item">
                    <label class="input-box">
                        <input :class="['input-effect', {'has-content': username}]" type="text" required odd="true" minLength="4" maxLength="16" v-model="username" @keyup.enter="register">
                        <span class="placeholder">请输入用户名</span>
                    </label>
                </div>
                <div class="login-item">
                    <label class="input-box">
                        <input :class="['input-effect', {'has-content': password}]" type="password" required v-model="password" @keyup.enter="register">
                        <span class="placeholder">请输入密码</span>
                    </label>
                </div>
                <div class="login-item">
                    <label class="input-box">
                        <input :class="['input-effect password-repeat', {'has-content': passwordRepeat}]" type="password" required v-model="passwordRepeat" @keyup.enter="register">
                        <span class="placeholder">请再次输入密码</span>
                        <svg class="input-border">
                            <polygon points="2,2 372,2 372,40 2,40"></polygon>
                        </svg>
                    </label>
                </div>
                <div class="login-item">
                    <label class="input-box">
                        <input :class="['input-effect', {'has-content': email}]" type="email" v-model="email" @keyup.enter="register">
                        <span class="placeholder">请输入邮箱</span>
                        <svg class="input-border">
                            <polygon points="2,2 372,2 372,40 2,40"></polygon>
                        </svg>
                    </label>
                </div>
            </validate>
            <div class="login-item">
                <input type="button" class="login-btn" @click="register" :disabled="!loginAble" value="注册">
            </div>
            <div class="login-item">
                <router-link :to="{name: 'login'}" class="color-blue fr">返回登录</router-link>
            </div>
        </div>
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>

    export default {
        name: 'register',
        data() {
            return {
                username: '',
                password: '',
                passwordRepeat: '',
                email: '',
                loginAble: true
            }
        },
        computed: {},
        created() {
            LocalStorage.del('user');
        },
        methods: {
            register() {
                if (!this.$refs.validate.validForm()) {
                    return false;
                }
                if (this.password !== this.passwordRepeat) {
                    this.$refs.validate.showWarn('两次输入的密码不一致', document.querySelector('.input-effect.password-repeat'));
                    return false;
                }
                this.fetchGraphql({
                    query: `mutation($data: UserUpdateIpt) {
                        user(data: $data) {
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
                            email: this.email
                        }
                    }
                }, true).then(({status, message, data: {user}}) => {
                    if (status !== 200) {
                        return this.tip(message);
                    }
                    LocalStorage.set('user', user, {hour: 6});
                    this.$store.commit('SET_USER', user);
                    this.tip('注册成功', 'success');
                    this.$router.push('/');
                }).catch(err => {
                    console.log(err);
                    this.tip('注册失败', 'success');
                });
            }
        }
    }

</script>

<style lang="scss" type="text/scss">
    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';

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