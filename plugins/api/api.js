import store from '../../store'

let preUtl = "http://pdd.chaoniuma.cn/";
// let preUtl = "http://192.168.50.158/";

export default {
	$_get(url, data = {}, option = {
		auth: false,
		loading: true
	}) {
		if (option.auth) {
			if (store.state.hasLogin) {
				data.token = store.state.token;
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				});
				return new Promise(resolve => resolve())
			}
		}
		if (option.loading) {
			uni.showLoading({
				title: '正在加载'
			})
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: preUtl + url,
				data,
				method: "GET"
			}).then(data => {
				uni.hideLoading();
				var [error, res] = data;
				if (!res) {
					console.log(error);
				} else {
					resolve(res.data);
				}
			})
		})

	},
	$_post(url, data = {}, option = {
		auth: false,
		loading: true
	}) {
		if (option.auth) {
			if (store.state.hasLogin) {
				data.token = store.state.token;
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				});
				return new Promise(resolve => resolve())
			}
		}
		if (option.loading) {
			uni.showLoading({
				title: '正在加载'
			})
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: preUtl + url,
				data,
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
			}).then(data => {
				uni.hideLoading();
				var [error, res] = data;
				if (!res) {
					console.log(error);
				} else {
					resolve(res.data);
				}
			})
		})
	}
}
