<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="title">
				{{ title }}
				<uni-icons type="arrowright" size="18" color="#000" />
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="mobile" :value="phone" placeholder="输入手机号码" maxlength="11" data-key="phone" @input="inputChange" />
				</view>
				<view class="input-item yzm">
					<view style="flex:1;">
						<input type="mobile" :value="authcode" placeholder="输入验证码" placeholder-class="input-empty" maxlength="4" data-key="authcode" @input="inputChange" />
					</view>
					<view class="btn-box">
						<!-- <button @click="getyzm()" class="yzm" :class="yzm ? 'noclick' : ''">
							获取验证码
							<text v-if="yzm">({{ djs }})</text>
						</button> -->
						<button v-if="!yzm" @click="getyzm()">获取验证码</button>
						<text v-else>({{ djs }})后重发</text>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="tolR" :disabled="logining">登录</button>
		</view>
		<view v-if="promptVisible" class="authcode">
			<view class="uni-mask">
				<view class="wrapper">
					<view class="title">
						邀请码
						<uni-icons type="arrowright" size="18" color="#000" />
					</view>
					<view class="title2">请填写邀请码</view>
					<view class="input-content">
						<view class="input-item"><input :value="invcode" :focus="promptVisible" maxlength="11" @input="input" /></view>
					</view>
					<text class="desc">长按粘贴邀请码</text>
					<button class="confirm-btn" @click="toRegister">确定</button>
				</view>
			</view>
		</view>

		<view v-if="wxphone" class="container-weixin">
			<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
			<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
			<view class="wrapper-weixin">
				<view class="logo-box">
					<image class="logo" :src="wxMember.avatarUrl" mode="aspectFill"></image>
					<text class="name">{{ wxMember.nickName }}</text>
				</view>

				<button class="confirm-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="logining">绑定当前手机号</button>
				<view class="forget-section" @click="wxphone = false">
					使用其他手机号
					<uni-icons class="rarr-icon" type="arrowright" size="15" color="#4e4e4e" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
	components: { uniIcons },
	computed: {
		...mapState(['shotId', 'redId'])
	},
	data() {
		return {
			phone: '',
			yzm: false,
			jsyzm: false,
			password: '',
			invcode: '',
			authcode: '1234',
			logining: false,
			djs: 60,
			isRegister: false,
			promptVisible: false,
			wxMember: { id: '' },
			title: '手机号登录',
			wxphone: false
		};
	},
	onLoad(options) {
		if (options.wxMember) {
			this.title = '绑定手机号';
			this.wxphone = true;
			this.$_get('app_member/wxMember', { id: options.wxMember }).then(res => {
				if (res.errcode == 200) {
					this.wxMember = res.wxMember;
					console.log(this.wxMember);
				} else {
					this.wxphone = false;
				}
			});
		}
	},
	watch: {
		yzm(newval, oldval) {
			var _this = this;
			if (newval == true) {
				var interv = setInterval(() => {
					if (_this.djs == 1) {
						_this.yzm = false;
						_this.djs = 60;
						clearInterval(interv);
					} else {
						_this.djs--;
					}
				}, 1000);
			}
		}
	},
	methods: {
		getPhoneNumber(phoneRes) {
			var _this = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					_this.$_post('app_WXLogin/wxPhone', { code: loginRes.code, encryptedData: phoneRes.detail.encryptedData, iv: phoneRes.detail.iv }).then(res => {
						_this.phone = res.phoneNumber;
						_this.jsyzm = true;
						_this.tolR2();
					});
				}
			});
		},
		input(e) {
			this.invcode = e.detail.value;
		},
		...mapActions(['register', 'login', 'setShotId', 'loginAndBindPhone']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.navigateBack();
		},
		getyzm() {
			if (!this.yzm) {
				if (this.phone == '') {
					this.$api.msg('请输入手机号码!');
					return;
				}
				this.$_get('app_sms/get', { phone: this.phone })
					.then(res => {
						this.$api.msg(res.msg);
						if (res.flag) {
							this.yzm = true;
							this.jsyzm = true;
							this.isRegister = res.register;
						} else {
						}
					})
					.catch(res => {
						this.$api.msg('请求失败!');
					});
			}
		},
		tolR() {
			if (this.redId != null && this.redId != '') {
				this.loginAndBindPhone({ phone: this.phone, authcode: this.authcode, redId: this.redId, wxMember: this.wxMember.id })
					.then(res => {
						this.logining = false;
						this.$api.msg('登录成功');
						this.$store.state.redId = '';
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}, 200);
					})
					.catch(res => {
						this.logining = false;
						this.$api.msg(res.msg);
					});
				return;
			}

			if (!this.jsyzm) {
				this.$api.msg('请接接收证码!');
				return;
			}
			if (this.isRegister) {
				//登录
				this.logining = true;
				this.login({ phone: this.phone, code: this.authcode, wxMember: this.wxMember.id })
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
			} else {
				//输入邀请码 注册
				if (this.shotId != null && this.shotId != '') {
					this.invcode = this.shotId;
				}
				this.toRegister();
			}
		},
		toRegister(isShotId = false) {
			this.logining = true;
			this.register({ phone: this.phone, invcode: this.invcode, authcode: this.authcode, wxMember: this.wxMember.id })
				.then(res => {
					this.logining = false;
					this.$api.msg('注册成功');
					setTimeout(() => {
						if (isShotId) {
							this.setShotId(null);
							uni.switchTab({
								url: '/pages/index/index'
							});
						} else {
							uni.navigateBack();
						}
					}, 200);
				})
				.catch(res => {
					this.logining = false;
					this.$api.msg(res.msg);
				});
		},
		tolR2() {
			if (this.redId != null && this.redId != '') {
				this.loginAndBindPhone({ phone: this.phone, redId: this.redId, wxMember: this.wxMember.id })
					.then(res => {
						this.logining = false;
						this.$api.msg('登录成功');
						this.$store.state.redId = '';
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}, 200);
					})
					.catch(res => {
						this.logining = false;
						this.$api.msg(res.msg);
					});
				return;
			}

			if (this.isRegister) {
				//登录
				this.logining = true;
				this.login({ phone: this.phone, wxMember: this.wxMember.id })
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
			} else {
				//输入邀请码 注册
				//输入邀请码 注册
				if (this.shotId != null && this.shotId != '') {
					this.invcode = this.shotId;
				}
				this.toRegister2();
			}
		},
		toRegister2(isShotId = false) {
			this.logining = true;
			this.register({ phone: this.phone, invcode: this.invcode, wxMember: this.wxMember.id })
				.then(res => {
					this.logining = false;
					this.$api.msg('注册成功');
					setTimeout(() => {
						if (isShotId) {
							this.setShotId(null);
							uni.switchTab({
								url: '/pages/index/index'
							});
						} else {
							uni.navigateBack();
						}
					}, 200);
				})
				.catch(res => {
					this.logining = false;
					this.$api.msg(res.msg);
				});
		},
		toLogin() {
			uni.redirectTo({
				url: '/pages/public/login'
			});
		}
	}
};
</script>

<style lang="scss">
.container-weixin {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 9999;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
	.wrapper-weixin {
		padding-top: 300upx;
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
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
				margin-top: 46upx;
				font-size: 45upx;
				font-weight: 600;
			}
		}

		.confirm-btn {
			width: 590upx;
			height: 76upx;
			margin-top: 200upx;
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
			margin-top: 70upx;
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
}
.authcode {
	font-size: 40upx;
	.uni-mask {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: #fff;
	}
	.wrapper {
		padding-top: 150upx;
		.title {
			font-size: 42upx;
		}
		.title2 {
			padding-left: 60upx;
			color: $font-color-grey;
			font-size: 28upx;
		}
		.input-content {
			margin-top: 100upx;
			height: 100upx;
			.input-item {
				height: 100%;
				border-bottom: solid 12upx $font-color-red;
				input {
					font-size: 48upx;
					height: 100%;
					letter-spacing: 6upx;
					font-weight: 600;
				}
			}
		}
		.desc {
			padding-left: 60upx;
			color: $font-color-grey;
			font-size: 28upx;
		}
		.confirm-btn {
			margin-top: 10upx;
		}
	}
}
page {
	background: #fff;
}
.container {
	padding-top: 120upx;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
		.input-content {
			padding: 0 60upx;
		}
		.input-item {
			padding: 0 30upx;
			padding-left: 0;
			background: #fff;
			height: 160upx;
			margin-bottom: 50upx;
			border-bottom: solid 2upx #c1c1c1;
			&:last-child {
				margin-bottom: 0;
			}
			.tit {
				height: 90upx;
				line-height: 96upx;
				font-size: $font-sm + 6upx;
				color: $font-color-base;
			}
			input {
				height: 60upx;
				color: $font-color-dark;
				width: 100%;
				font-size: 30upx;
			}
		}
		.title {
			font-size: 36upx;
			padding-left: 60upx;
			padding-top: 60upx;
			padding-bottom: 20upx;
		}

		.confirm-btn {
			width: 630upx;
			height: 86upx;
			line-height: 86upx;
			font-weight: 600;
			margin-top: 70upx;
			background: $font-color-red;
			color: #fff;
			font-size: $font-lg;
			&:after {
			}
		}
		.forget-section {
			font-size: $font-sm + 2upx;
			color: $font-color-spec;
			text-align: center;
			margin-top: 40upx;
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
		.yzm {
			display: flex;
			height: 70upx;
			.btn-box {
				align-self: flex-end;
				position: relative;
				right: 0;
				button {
					background-color: $font-color-red;
					color: #fff;
					font-size: 24upx;
					margin-left: auto;
					height: 65upx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 6upx;
					margin-bottom: 8upx;
					margin-right: -22upx;
				}
			}
			text {
				color: $font-color-grey;
				font-size: 32upx;
				margin-right: -28upx;
				line-height: 60upx;
			}
		}
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
}
</style>
