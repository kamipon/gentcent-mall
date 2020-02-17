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
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider.member
			})
			uni.setStorage({ //缓存用户登陆状态
				key: 'token',
				data: provider.token
			})
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {
		register({state,commit,dispatch}, provider={phone:'',password:'',invcode:'',authcode:''}) {
			return new Promise(reslove => {
				api.$_post('app_member/register', provider).then(res => {
					commit('login',{member:res.member,token:res.token});
					reslove(res);
				});
			});

		},
	}
})

export default store
