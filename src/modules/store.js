import Vue from 'vue'
import Vuex from 'vuex'
import {fetchGraphql} from '../common/plugin/function/graphql'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const modules = {};

let store = new Vuex.Store({
    state: {
        user: {},
        typeList: [],
        typeObj: {}
    },
    getters: {
        getUser(state) {
            if (state.user && Object.keys(state.user).length > 0) {
                return state.user;
            }
            let user = LocalStorage.get('user');
            if (user) {
                return user;
            }
            return {};
        }
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_TYPE_LIST(state, list) {
            state.typeList = list;
            state.typeObj = {};
            for (let item of list) {
                state.typeObj[item.id] = item;
            }
        }
    },
    actions: {
        getTypeList({commit}) {
            let typeList = LocalStorage.get('types');
            if (typeList && typeList.length) {
                commit('SET_TYPE_LIST', typeList);
                return false;
            }
            fetchGraphql({
                query: `query($data: PageIpt) {
                    typeList(data: $data) {
                        total
                        list{
                            id
                            name
                            total
                        }
                    }
                }`,
                variables: {
                    data: {
                        page: -1
                    }
                }
            }, true).then(({status, data: {typeList: {list, total}}}) => {
                if (status === 200) {
                    commit('SET_TYPE_LIST', list);
                    LocalStorage.set('types', list, {hour: 2});
                }
            }).catch(err => {
                commit('SET_TYPE_LIST', []);
            });
        }
    },
    modules,
    plugins: debug ? [require('vuex/dist/logger')()] : [],
    strict: debug
});

export default store;