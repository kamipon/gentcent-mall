export default {
	$_get(url, data) {
		return new Promise((resolve,reject)=>{
			uni.request({
				url: "http://192.168.50.158/" + url,
				data,
				method: "GET"
			}).then(data=>{
				var [error, res]  = data;
				resolve(res.data);
			})
		})
	},
	async $_post(url, data) {
		return new Promise((resolve,reject)=>{
			uni.request({
				url: "http://192.168.50.158/" + url,
				data,
				method: "POST"
			}).then(data=>{
				var [error, res]  = data;
				resolve(res.data);
			})
		})
	}
}
