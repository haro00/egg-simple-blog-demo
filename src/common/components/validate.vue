<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

    export default {
        name: 'validate',
        props: {
            // 滚动条出现的dom元素选择器, 如'.wrapper'
            box: {
                type: String,
                // default: 'body'
                default: '.main-wrap'
            },
            // 提示信息位置,可选top,right和bottom,默认top
            position: {
                type: String,
                default: 'top'
            }
        },
        data() {
            return {
                // 可校验属性列表，不验证的属性值为'false'或false时才无效
                attr: {
                    // 不验证
                    invalid: 'invalid',
                    // 禁用的不验证
                    disabled: 'disabled',
                    // 必填
                    required: 'required',
                    // 最小长度
                    minLength: 'minlength',
                    // 最大长度
                    maxLength: 'maxlength',
                    // 固定长度
                    length: 'length',
                    // 数字
                    number: 'number',
                    // 整数
                    int: 'int',
                    // 小数位数
                    decimal: 'decimal',
                    // 数字最大值
                    max: 'max',
                    // 数字最小值
                    min: 'min',
                    // 手机号码
                    tel: 'tel',
                    // 座机号码
                    phone: 'phone',
                    // 电子邮箱
                    email: 'email',
                    // url
                    url: 'url',
                    // 正则匹配
                    reg: 'reg',
                    // 密码
                    password: 'password',
                    // 特殊字符
                    odd: 'odd'
                },
                // 正则列表
                regexps: {
                    // url
                    url: /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/,
                    // 邮箱
                    email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/,
                    // 时分秒
                    timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
                    // 日期
                    dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
                    // 手机号码
                    tel: /^1[3|4|5|7|8]\d{9}$/,
                    // 座机号码
                    phone: /\d{3}-?\d{8}|\d{4}-?\d{7}|^400|^800/,
                    // 密码(字母开头,允许6-16位字母数字下划线)
                    password: /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/,
                    // 整数
                    int: /^-?[0-9]\d*$/,
                    // 数字
                    float: /^(-?\d+)(\.\d+)?$/,
                    // 特殊字符
                    odd: /[^\a-zA-Z0-9\u4e00-\u9FA5\-]/
                },
                // 提示信息气泡
                tip: null,
                // 外层出现滚动条的dom
                scrollDom: null,
                // 可校验的元素
                validElem: []
            }
        },
        mounted() {
            // 获取需要校验的元素并绑定事件
            this.getValidElem();
            // 获取外层出现滚动条的元素
            this.scrollDom = document.querySelector(this.box);
        },
        destroyed() {
            // 移除提示信息和事件
            this.removeWarn();
            for (let item of this.validElem) {
                item.removeEventListener('focus', this.validEvent);
                item.removeEventListener('input', this.validEvent);
                if (this.hasAttr(item, 'readonly')) {
                    item.removeEventListener('blur', this.validEvent);
                }
            }
        },
        methods: {
            /**
             * 是否为空
             * @param val
             * @returns {boolean}
             */
            isEmpty(val) {
                val = String(val).trim();
                if (val === null) {
                    return true;
                }
                if (val === undefined || val === 'undefined') {
                    return true;
                }
                if (val === '') {
                    return true;
                }
                if (val.length === 0) {
                    return true;
                }
                return !/[^(^\s*)|(\s*$)]/.test(val);
            },
            /**
             * 去掉html的标签和空白
             * @param html
             * @returns {string}
             */
            removeHTMLTag(html) {
                html = html.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
                html = html.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
                html = html.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
                html = html.replace(/&nbsp;/ig, '');//去掉&nbsp;
                html = html.replace(/\s/g, ''); //将空格去掉
                return html;
            },
            /**
             * html是否为空
             * @param html
             * @returns {boolean}
             */
            isEmptyHtml(html) {
                if (/<img/.test(html)) {
                    return false;
                }
                return this.isEmpty(this.removeHTMLTag(html));
            },

            /**
             * 是否含有某属性
             * @param dom
             * @param attr
             * @returns {boolean}
             */
            hasAttr(dom, attr) {
                let str = dom.getAttribute(attr);
                return typeof str !== 'undefined' && str !== 'false' && str !== null;
            },
            /**
             * 正则校验,不通过返回true
             * @param val
             * @param regexps
             * @returns {boolean}
             */
            validPattern(val, regexps) {
                let regexpsExp = new RegExp(regexps);
                return !regexpsExp.test(val);
            },
            /**
             * 显示错误提示信息
             * @param text
             * @param dom
             * @param symbol  //用来区分不同的警告提示信息
             */
            showWarn(text, dom, symbol) {
                let [offset, width, height] = [dom.getBoundingClientRect(), dom.offsetWidth, dom.offsetHeight];
                let boxOffset = this.box === 'body' ? {
                    left: 0,
                    top: 0
                } : this.scrollDom.getBoundingClientRect();
                // 元素上使用data-tip属性添加自定义提示信息
                let tipText = text;
                let attrTip = dom.getAttribute('data-tip');
                let attrTipSymbol = dom.getAttribute('data-tip-' + symbol);
                if (attrTip) {
                    tipText = attrTip;
                }
                if (attrTipSymbol) {
                    tipText = attrTipSymbol;
                }
                let tipTop = offset.top + this.scrollDom.scrollTop - boxOffset.top;
                let tipLeft = offset.left + width + 4 - boxOffset.left;
                tipLeft = tipLeft > this.scrollDom.clientWidth ? this.scrollDom.clientWidth : tipLeft;
                // 已经有提示信息就改变内容和位置
                if (this.tip) {
                    if (this.tip.innerText !== tipText) {
                        this.tip.innerText = tipText;
                    }
                    let [top, left] = [0, 0];
                    if (this.position === 'right') {
                        top = tipTop + (height - this.tip.offsetHeight) / 2;
                        left = tipLeft;
                    } else if (this.position === 'bottom') {
                        top = tipTop + height;
                        left = offset.left - boxOffset.left;
                    } else {
                        top = tipTop - this.tip.offsetHeight - 3;
                        left = tipLeft - this.tip.offsetWidth;
                    }
                    if (parseInt(this.tip.style.top) !== top) {
                        this.tip.style.top = top + 'px';
                    }
                    if (parseInt(this.tip.style.left) !== left) {
                        this.tip.style.left = left + 'px';
                    }
                } else {
                    // 没有提示信息就添加
                    this.tip = document.createElement('span');
                    this.tip.classList.add(`error-${this.position}`);
                    this.tip.innerText = tipText;
                    this.scrollDom.insertBefore(this.tip, this.scrollDom.firstChild);
                    let [top, left] = [0, 0];
                    if (this.position === 'right') {
                        top = tipTop + (height - this.tip.offsetHeight) / 2;
                        left = tipLeft;
                    } else if (this.position === 'bottom') {
                        top = tipTop + height;
                        left = offset.left - boxOffset.left;
                    } else {
                        top = tipTop - this.tip.offsetHeight - 3;
                        left = tipLeft - this.tip.offsetWidth;
                    }
                    this.tip.style.top = top + 'px';
                    this.tip.style.left = left + 'px';
                }
                //this.scrollDom.scrollTop = offset.top + this.scrollDom.scrollTop - this.tip.offsetHeight - height;
                // 需校验的元素的错误样式
                dom.classList.add('error');
            },
            /**
             * 去掉提示信息
             */
            removeWarn() {
                if (this.tip) {
                    this.scrollDom.removeChild(this.tip);
                    this.tip = null;
                }
            },
            /**
             * 获取需要校验的元素并绑定事件, 调用时请保证dom已经加载完
             */
            getValidElem() {
                let vm = this;
                let domList = [];

                // 查找子元素中可校验的元素
                function getChildren(dom) {
                    let children = [...dom.children];
                    if (children.length > 0) {
                        for (let item of children) {
                            if (item.tagName.toLowerCase() === 'input' || item.tagName.toLowerCase() === 'textarea' || vm.hasAttr(item, 'contenteditable')) {
                                domList.push(item);
                                item.addEventListener('input', vm.validEvent, false);
                                item.addEventListener('focus', vm.validEvent, false);
                                if (vm.hasAttr(item, 'readonly')) {
                                    item.addEventListener('blur', vm.validEvent, false);
                                }
                            } else {
                                getChildren(item);
                            }
                        }
                    }
                }

                for (let item of this.$slots.default) {
                    if (item.tag === 'input' || item.tag === 'textarea' || (item.tag && this.hasAttr(item.elm, 'contenteditable'))) {
                        domList.push(item.elm);
                        item.elm.addEventListener('input', this.validEvent, false);
                        item.elm.addEventListener('focus', this.validEvent, false);
                        if (this.hasAttr(item.elm, 'readonly')) {
                            item.elm.addEventListener('blur', this.validEvent, false);
                        }
                    }
                    if (item.elm.nodeType == 1) {
                        getChildren(item.elm);
                    }
                }
                this.validElem = domList;
            },
            /**
             * 执行单个表单元素校验, 绑定input事件使用
             * @param event
             */
            validEvent(event) {
                if (this.validInput(event.target)) {
                    this.removeWarn();
                    event.target.classList.remove('error');
                }
            },
            /**
             * 单个表单元素校验,不通过返回false
             * @param dom
             * @returns {boolean}
             */
            validInput(dom) {
                // 不验证,直接通过
                if (this.hasAttr(dom, this.attr.invalid) || this.hasAttr(dom, this.attr.disabled)) {
                    return true;
                }
                let value = dom.value ? dom.value : dom.innerText;
                // 必填
                if (this.hasAttr(dom, this.attr.required)) {
                    if (this.isEmpty(value)) {
                        this.showWarn('不能为空', dom, this.attr.required);
                        return false;
                    }
                }

                if (!this.isEmpty(value)) {
                    // 特殊字符
                    if (this.hasAttr(dom, this.attr.odd)) {
                        if (!this.validPattern(value, this.regexps.odd)) {
                            this.showWarn('不能含有非法字符', dom, this.attr.odd);
                            return false;
                        }
                    }
                    // 数字
                    if (dom.getAttribute('type') === this.attr.number) {
                        if (this.hasAttr(dom, this.attr.int) && this.validPattern(value, this.regexps.int)) {
                            this.showWarn('必须为整数', dom, this.attr.number);
                            return false;
                        }
                        if (this.validPattern(value, this.regexps.float)) {
                            this.showWarn('必须为数字', dom, this.attr.number);
                            return false;
                        }
                        if (this.hasAttr(dom, this.attr.decimal)) {
                            let decimal = dom.getAttribute(this.attr.decimal);
                            if (this.validPattern(value, '^\\d+(\\.\\d{1,' + decimal + '})?$')) {
                                this.showWarn(`最多${decimal}位小数`, dom, this.attr.number);
                                return false;
                            }
                        }
                        if (this.hasAttr(dom, this.attr.max)) {
                            let max = parseFloat(dom.getAttribute(this.attr.max));
                            if (!isNaN(max) && max < parseFloat(value)) {
                                this.showWarn(`数字不能大于${max}`, dom, this.attr.max);
                                return false;
                            }
                        }
                        if (this.hasAttr(dom, this.attr.min)) {
                            let min = parseFloat(dom.getAttribute(this.attr.min));
                            if (!isNaN(min) && min > parseFloat(value)) {
                                this.showWarn(`数字不能小于${min}`, dom, this.attr.max);
                                return false;
                            }
                        }
                    }
                    // 密码
                    if (dom.getAttribute('type') === this.attr.password || this.hasAttr(dom, this.attr.password)) {
                        if (this.validPattern(value, this.regexps.password)) {
                            this.showWarn('字母开头,允许6-16位字母数字下划线', dom, this.attr.password);
                            return false;
                        }
                    }
                    // 定长
                    if (this.hasAttr(dom, this.attr.length)) {
                        let length = dom.getAttribute(this.attr.length);
                        if (value.length !== parseInt(length)) {
                            this.showWarn(`必须为${length}位`, dom, this.attr.length);
                            return false;
                        }
                    }
                    // 最小长度
                    if (this.hasAttr(dom, this.attr.minLength)) {
                        let length = dom.getAttribute(this.attr.minLength);
                        if (value.length < parseInt(length)) {
                            this.showWarn(`最少为${length}位`, dom, this.attr.minLength);
                            return false;
                        }
                    }
                    // 最大长度
                    if (this.hasAttr(dom, this.attr.maxLength)) {
                        let length = dom.getAttribute(this.attr.maxLength);
                        if (value.length > parseInt(length)) {
                            this.showWarn(`最多为${length}位`, dom, this.attr.maxLength);
                            return false;
                        }
                    }
                    // 手机号
                    if (dom.getAttribute('type') === this.attr.tel) {
                        if (this.validPattern(value, this.regexps.tel)) {
                            this.showWarn('格式不正确', dom, this.attr.tel);
                            return false;
                        }
                    }
                    // 电子邮箱
                    if (dom.getAttribute('type') === this.attr.email) {
                        if (this.validPattern(value, this.regexps.email)) {
                            this.showWarn('格式不正确', dom, this.attr.email);
                            return false;
                        }
                    }
                    // url
                    if (dom.getAttribute('type') === this.attr.url) {
                        if (this.validPattern(value, this.regexps.url)) {
                            this.showWarn('格式不正确', dom, this.attr.url);
                            return false;
                        }
                    }
                    // 正则
                    if (this.hasAttr(dom, this.attr.reg)) {
                        if (this.validPattern(value, dom.getAttribute(this.attr.reg))) {
                            this.showWarn('格式不正确', dom, this.attr.reg);
                            return false;
                        }
                    }
                }
                return true;
            },
            /**
             * 校验所有的表单元素, 最后提交时调用该方法判断是否可以提交
             * @returns {boolean}
             */
            validForm() {
                let boo = true;
                for (let item of this.validElem) {
                    boo = this.validInput(item);
                    if (!boo) {
                        break;
                    }
                }
                return boo;
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import '../../common/scss/base/variables';

    // 位于上边
    .error-top{
        position: absolute;
        z-index: $index-popup;
        display: block;
        padding: 2px 6px;
        background-color: $red;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
        transition: all .2s ease;
        color: #fff;
        white-space: nowrap;
        &:after{
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            width: 0;
            height: 0;
            margin-left: -1px;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-top: 4px solid $red;
        }
    }

    // 位于右边和下边
    .error-right, .error-bottom{
        position: absolute;
        z-index: $index-popup;
        display: block;
        padding: 2px 0;
        font-size: 12px;
        text-align: center;
        transition: all .2s ease;
        color: $red;
        white-space: nowrap;
        &:before{
            content: '!';
            display: inline-block;
            height: 12px;
            width: 12px;
            margin-right: 2px;
            border-radius: 50%;
            background: $red;
            color: #fff;
            text-align: center;
            line-height: 12px;
        }
    }

    // 表单元素验证不通过样式
    .error{
        border-color: $red !important;
        box-shadow: inset 0 0 3px $red;
    }
</style>