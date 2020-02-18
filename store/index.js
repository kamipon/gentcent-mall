import Vue from 'vue'
import Vuex from 'vuex'
import api from '../plugins/api/api.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		token: "",
		userInfo: {},
		webviewSrc: ""
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider.member;
			state.token = provider.token
			uni.setStorage({ //缓存用户登陆令牌
				key: 'token',
				data: provider.token
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			state.token = "";
			uni.removeStorage({
				key: 'token'
			})
		}
	},
	actions: {
		login({state,commit,dispatch}, provider={phone:'',password:''}) {
			return new Promise((resolve,reject) => {
				api.$_post('app_member/login', provider).then(res => {
					if(res.errcode==200){
						commit('login',{member:res.member,token:res.token});
						resolve(res);
					}else{
						reject(res);
					}
				});
			});
		},
		loginWithToken({state,commit,dispatch}, token) {
			return new Promise((resolve,reject) => {
				api.$_post('app_member/login_token', {token}).then(res => {
					if(res.errcode==200){
						commit('login',{member:res.member,token:res.token});
						resolve(res);
					}else{
						uni.removeStorage({key: "token"})
						reject(res);
					}
				});
			});
		},
		logout({state,commit,dispatch}) {
			return new Promise((resolve,reject) => {
				api.$_post('app_member/logout', {},{auth:true}).then(res => {
					if(res.errcode==200){
						commit('logout');
						resolve(res);
					}else{
						reject(res);
					}
				});
			});
		},
		register({state,commit,dispatch}, provider={phone:'',password:'',invcode:'',authcode:''}) {
			return new Promise((resolve,reject) => {
				api.$_post('app_member/register', provider).then(res => {
					if(res.errcode==200){
						commit('login',{member:res.member,token:res.token});
						resolve(res);
					}else{
						reject(res);
					}
					
				});
			});
		},
	}
})

export default store
