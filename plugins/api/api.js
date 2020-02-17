export default {
	$_get(url, data = {}, option = {
		auth: false
	}) {
		if (option.auth) {
			if (this.$store.state.hasLogin) {
				data.token = this.$store.state.token;
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				});
				return new Promise(resolve => resolve())
			}
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: "http://192.168.50.158/" + url,
				data,
				method: "GET"
			}).then(data => {
				var [error, res] = data;
				resolve(res.data);
			})
		})

	},
	async $_post(url, data = {}, option = {
		auth: false
	}) {
		if (option.auth) {
			if (this.$store.state.hasLogin) {
				data.token = this.$store.state.token;
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				});
				return new Promise(resolve => resolve())
			}
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: "http://192.168.50.158/" + url,
				data,
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
			}).then(data => {
				var [error, res] = data;
				resolve(res.data);
			})
		})
	}
}
