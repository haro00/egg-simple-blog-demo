<template>
    <div class="main user-wrap" v-title="'用户管理'">
        <div class="tool-bar">
            <input type="text" class="input-text" placeholder="按用户名搜索" v-model="searchText" @keyup.enter="search"/>
            <input type="button" class="btn-search" value="搜索" @click="search"/>
            <input type="button" class="btn-add" value="添加用户" @click="add"/>
        </div>
        <table-list :loading="loading" :thead="thead" :tbody="tbody">
            <div class="td" slot="th-after">
                <p>角色类型</p>
            </div>
            <div class="td" slot="th-after">
                <p>创建日期</p>
            </div>
            <div class="td" slot="th-after">
                <p>状态</p>
            </div>
            <div class="td" slot="th-after">
                <p>操作</p>
            </div>
            <template slot="td-after" slot-scope="props">
                <div class="td">
                    <p v-text="roleType[props.item.roleId]"></p>
                </div>
                <div class="td">
                    <p v-if="props.item.createTime" v-text="dateFormat(new Date(props.item.createTime), 'yyyy-MM-dd')"></p>
                </div>
                <div class="td">
                    <p v-text="props.item.state == 1 ? '正常' : '禁用'"></p>
                </div>
                <div class="td td-opr">
                    <p v-if="props.item.roleId === 1">无权限操作</p>
                    <p v-else>
                        <a href="javascript: void(0);" @click="edit(props.item, props.index)">编辑</a>
                        <a href="javascript: void(0);" v-if="user.id !== props.item.id && props.item.roleId !== 1">删除</a>
                    </p>
                </div>
            </template>
        </table-list>
        <pages :page.sync="page" :total="pageTotal"></pages>
        <popup :show.sync="showUserPop" class="popup-user">
            <span slot="title" v-text="editIndex > -1 ? '编辑用户' : '添加用户'"></span>
            <validate class="form-list" slot="content" ref="valid" box=".pop-content">
                <div class="form-item">
                    <span class="item-title"><span class="required">用户名:</span></span>
                    <input type="text" class="input-text" data-tip="以字母开头,4-16位字母,数字,下划线的组合" v-model="userItem.name" reg="^[a-zA-Z][a-zA-Z0-9_]{3,15}$" required/>
                </div>
                <div class="form-item">
                    <span class="item-title"><span :class="{required: editIndex < 0}">密码:</span></span>
                    <input type="password" class="input-text" :placeholder="editIndex < 0 ? '' : '无需修改密码,请不要填写'" v-model="userItem.password" :required="editIndex < 0"/>
                </div>
                <div class="form-item">
                    <span class="item-title">邮箱:</span>
                    <input type="email" class="input-text" v-model="userItem.email"/>
                </div>
                <div class="form-item" v-if="user.roleId == 1 && userItem.roleId != 1">
                    <span class="item-title"><span class="required">角色:</span></span>
                    <label class="input-radio">
                        <input type="radio" :value="3" v-model="userItem.roleId"/>
                        <span>普通成员</span>
                    </label>
                    <label class="input-radio">
                        <input type="radio" :value="2" v-model="userItem.roleId"/>
                        <span>管理员</span>
                    </label>
                </div>
                <div class="form-item">
                    <span class="item-title"><span class="required">状态:</span></span>
                    <label class="input-radio">
                        <input type="radio" :value="1" v-model="userItem.state"/>
                        <span>启用</span>
                    </label>
                    <label class="input-radio">
                        <input type="radio" :value="0" v-model="userItem.state"/>
                        <span>禁用</span>
                    </label>
                </div>
            </validate>
            <input type="button" slot="btn" class="pop-btn-default" value="保存" @click="save"/>
            <input type="button" slot="btn" class="pop-btn-cancel" value="取消" @click="showUserPop = false"/>
        </popup>
    </div>
</template>

<script>

    export default {
        name: 'userList',
        props: {
            // 当前页
            page: {
                default: 1
            }
        },
        data() {
            let {search} = this.$route.query;
            return {
                // 表头
                thead: {
                    name: '用户名',
                    email: '邮箱',
                },
                // 表数据
                tbody: [],
                // 角色类型
                roleType: {
                    1: '超级管理员',
                    2: '管理员',
                    3: '普通成员'
                },
                // 搜索内容
                searchText: search ? search : '',
                // 每页条数
                pageSize: 20,
                // 总页数
                pageTotal: 0,
                // 列表加载状态
                loading: false,
                // 显示添加/编辑用户
                showUserPop: false,
                // 添加/编辑用户
                userItem: {},
                // 编辑用户当前页索引
                editIndex: -1
            };
        },
        computed: {
            user() {
                return this.$store.getters.getUser;
            }
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
                this.fetchGraphql({
                    query: `query($data: PageIpt) {
                        userList(data: $data){
                            total
                            list{
                                id
                                name
                                email
                                roleId
                                state
                                createTime
                            }
                        }
                    }`,
                    variables: {
                        data: {
                            search,
                            page: this.page,
                            pageSize: this.pageSize
                        }
                    }
                }).then(({status, data: {userList: {list, total}}}) => {
                    if (status === 200) {
                        this.tbody = list;
                        this.pageTotal = Math.ceil(total / this.pageSize);
                    }
                    this.loading = false;
                }).catch(err => {
                    this.tbody = [];
                    this.pageTotal = 0;
                    this.loading = false;
                });
            },
            // 添加用户
            add() {
                this.editIndex = -1;
                this.userItem = {
                    name: '',
                    password: '',
                    email: '',
                    roleId: 3,
                    state: 1
                };
                this.showUserPop = true;
            },
            // 编辑用户
            edit(user, index) {
                this.editIndex = index;
                this.userItem = {
                    ...user,
                    password: ''
                };
                this.showUserPop = true;
            },
            // 保存用户
            save() {
                if (!this.$refs.valid.validForm()) {
                    return false;
                }
                this.fetchGraphql({
                    query: `mutation($data: UserUpdateIpt) {
                        user(data: $data){
                            id
                        }
                    }`,
                    variables: {
                        data: this.userItem
                    }
                }).then(({status, data: {user}}) => {
                    if (status === 200) {
                        if (this.editIndex > -1) {
                            this.tbody.splice(this.editIndex, 1, this.userItem);
                            this.showUserPop = false;
                            return this.tip(`编辑用户${this.userItem.name}成功`, 'success');
                        }
                        if (this.page == 1) {
                            this.getList();
                        } else {
                            let {name} = this.$route;
                            this.$router.push({
                                name,
                                params: {
                                    page: 1
                                }
                            });
                        }
                        this.tip(`添加用户${this.userItem.name}成功`, 'success');
                        this.showUserPop = false;
                    } else {
                        this.tip('保存用户失败', 'error');
                    }
                }).catch(err => {
                    console.error(err);
                    this.tip('保存用户失败', 'error');
                });
            },
            // 搜索
            search() {
                let {name, params, query} = this.$route;
                this.$router.push({
                    name,
                    params: {
                        page: 1
                    },
                    query: {
                        search: this.searchText
                    }
                });
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "../../common/scss/base/variables";
    @import "../../common/scss/base/mixin";

    .user-wrap{
        .popup-user .popup{
            width: 500px;
        }
    }
</style>