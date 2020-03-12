<template>
	<!-- 用户信息模块 -->
	<view class="userBox">
		<!-- 昵称 -->
		<text class="nickName">{{nickNames}}</text>
		<!-- 头像 -->
		<image class="userIcon" :src="avatarUrl">头像</image>
 
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				nickNames: '匿名用户',
				avatarUrl: '../../../static/xcx03.jpeg',
				show: '',
				hidden: ''
			}
		},
		onLoad: function(option) {
			let that = this;
 
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes);
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							console.log(infoRes);
							that._data.nickNames = infoRes.userInfo.nickName;
							that._data.avatarUrl = infoRes.userInfo.avatarUrl;
						}
					});
				}
			});
 
		}
	}
</script>
 
 
<style>
	/* 用户盒子 */
	.userBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		background: linear-gradient(to top right, #63b8ff 0%, #4876ff 25%, #3a5fcd 100%);
	}
 
	/* 用户昵称 */
	.nickName {
		color: #ffffff;
	}
 
	/* 用户头像 */
	.userIcon {
		align-self: flex-end;
		border-radius: 50%;
		overflow: hidden;
		width: 100px;
		height: 100px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5)
	}
</style>