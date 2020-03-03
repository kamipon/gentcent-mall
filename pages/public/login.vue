<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				
			</view>
			<button class="confirm-btn" open-type='getUserInfo' @click="wxLogin" 
            :disabled="logining">微信一键登录</button>
			<view class="forget-section" @click="toRegist">
				使用手机号登录
			</view>
		</view>
	</view>
</template>

<script>
	import {  
        mapActions  
    } from 'vuex';
	
	export default{
		data(){
			return {
				phone: '',
				password: '',
				logining: false
			}
		},
		onLoad(){
			
		},
		methods: {
			...mapActions(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				uni.redirectTo({
					url:"/pages/public/register"
				})
			},
                
            wxLogin(){
                let _this = this;
                uni.getUserInfo({
                    provider: 'weixin',
                    success: (res)=> {
                        uni.login({
                          provider: 'weixin',
                          success:  (loginRes)=>{
                              
                            this.$_get("app_WXLogin/login",{
                                code: loginRes.code,
                                avatarUrl: res.userInfo.avatarUrl,
                                gender: res.userInfo.gender,
                                nickName: res.userInfo.nickName,
                                }).then(res3 => {
                                        console.log(res3)
                                    if(res3.flag){
                                        if(res3.register){//注册
                                            uni.redirectTo({
                                                url:`/pages/public/register?wxMember=${res3.wxMember}`
                                            })
                                        }else{ //用户存在 直接登录
                                            this.login({
                                                wxMember:res3.wxMember}).then(res => {
                                                this.logining = false;
                                                this.$api.msg('登录成功');
                                                setTimeout(()=>{
                                                    uni.navigateBack();
                                                }, 200)
                                            }).catch(res=>{
                                                this.logining = false;
                                                this.$api.msg(res.msg);
                                            });
                                        }
                                    }else{
                                        this.$api.msg(res3.msg); 
                                    }
                            })
                          }
                        });
                    },
                    fail(res) {
                         console.log(res)
                    }
                });
            },
			toLogin(){
				this.logining = true;
				this.login({phone: this.phone,password: this.password}).then(res => {
					this.logining = false;
					this.$api.msg('登录成功');
					setTimeout(()=>{
						uni.navigateBack();
					}, 200)
				}).catch(res=>{
					this.logining = false;
					this.$api.msg(res.msg);
				});
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 120upx;
        background: rgb(90, 200,80);
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
