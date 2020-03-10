<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="logo-box">
				<image class="logo" src="/static/logo.png" mode="aspectFill"></image>
				<text class="name">码上好省</text>
				<text class="desc">感恩生活中每一次小惊喜！</text>
			</view>

			<button class="confirm-btn" open-type="getUserInfo" @click="wxLogin" :disabled="logining">
				<uni-icons class="wx-icon" type="weixin" size="22" color="#fff" />
				微信一键登录
			</button>
			<view class="forget-section" @click="toRegist">
				使用手机号登录
				<uni-icons class="rarr-icon" type="arrowright" size="15" color="#4e4e4e" />
			</view>
			<view class="desc-section">
				登录即代表您已同意
				<text class="light">《用户协议》</text>
				和
				<text class="light">《隐私政策》</text>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import { mapActions } from 'vuex';

export default {
	comments: { uniIcons },
	data() {
		return {
			phone: '',
			password: '',
			logining: false
		};
	},
	onLoad() {},
	methods: {
		...mapActions(['login']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.navigateBack();
		},
		toRegist() {
			uni.redirectTo({
				url: '/pages/public/register'
			});
		},

		wxLogin() {
			let _this = this;
			uni.getUserInfo({
				provider: 'weixin',
				success: res => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							this.$_get('app_WXLogin/login', {
								code: loginRes.code,
								avatarUrl: res.userInfo.avatarUrl,
								gender: res.userInfo.gender,
								nickName: res.userInfo.nickName
							}).then(res3 => {
								console.log(res3);
								if (res3.flag) {
									if (res3.register) {
										//注册
										uni.redirectTo({
											url: `/pages/public/register?wxMember=${res3.wxMember}`
										});
									} else {
										//用户存在 直接登录
										this.login({
											wxMember: res3.wxMember
										})
											.then(res => {
												this.logining = false;
												this.$api.msg('登录成功');
												setTimeout(() => {
													uni.navigateBack();
												}, 200);
											})
											.catch(res => {
												this.logining = false;
												this.$api.msg(res.msg);
											});
									}
								} else {
									this.$api.msg(res3.msg);
								}
							});
						}
					});
				},
				fail(res) {
					console.log(res);
				}
			});
		},
		toLogin() {
			this.logining = true;
			this.login({ phone: this.phone, password: this.password })
				.then(res => {
					this.logining = false;
					this.$api.msg('登录成功');
					setTimeout(() => {
						uni.navigateBack();
					}, 200);
				})
				.catch(res => {
					this.logining = false;
					this.$api.msg(res.msg);
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.container {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	padding-top: 150upx;
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	top: 40upx;
	font-size: 40upx;
	color: $font-color-dark;
}
.input-content {
	padding: 0 60upx;
}
.logo-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	.logo {
		margin-right: 12upx;
		width: 220upx;
		height: 220upx;
	}
	.name {
		margin-top: 5upx;
		font-size: 40upx;
		font-weight: 600;
		color: #ea5c3c;
	}
	.desc {
		margin-top: 20upx;
		font-size: 24upx;
		color: $font-color-grey;
	}
}

.confirm-btn {
	width: 590upx;
	height: 76upx;
	margin-top: 250upx;
	background: #3f9a38;
	color: #fff;
	font-size: 36upx;
	display: flex;
	align-items: center;
	justify-content: center;
	&:after {
	}
	.wx-icon {
		margin-right: 10upx;
	}
}
.forget-section {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30upx;
	color: #4e4e4e;
	margin-top: 30upx;
	.rarr-icon {
		margin-left: 10upx;
	}
}
.desc-section {
	font-size: 24upx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top:70upx;
	color: $font-color-grey;
	.light {
		color: $font-color-spec;
	}
}
.register-section {
	position: absolute;
	left: 0;
	bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
</style>
