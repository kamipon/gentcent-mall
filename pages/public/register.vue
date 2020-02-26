<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">登录</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="mobile" :value="phone" 
                    placeholder="请输入手机号码" maxlength="11" data-key="phone" @input="inputChange" />
				</view>
				<view class="input-item yzm">
					<view style="flex:2">
                      <text class="tit">验证码</text>
                      <input type="mobile" :value="authcode" 
                      placeholder="请输入短信验证码" placeholder-class="input-empty" 
                      maxlength="20" data-key="authcode" @input="inputChange" /> 
                    </view>
                    <view >
                        <button @click="getyzm()" :class="yzm?'noclick':''">
                            获取验证码
                            <text v-if="yzm">({{djs}})</text>
                            
                        </button>
                    </view>
				</view>
			</view>
			<button class="confirm-btn" @click="tolR" :disabled="logining">登录</button>
		</view>
        <view v-if="promptVisible" class="authcode">
            <view class="uni-mask"></view>
            <view class="uni-modal">
                <view class="uni-modal__hd">
                    <text>请输入邀请码</text>
                    
                </view>
                <view class="uni-modal__bd">
                    <input  :value="invcode" focus="true"   placeholder="请输入邀请码" @input="input"/>
                </view>
                <view class="uni-modal__ft">
                    <view class="uni-modal__btn uni-modal__btn_default" @click="promptVisible=false">取消</view>
                    <view class="uni-modal__btn uni-modal__btn_primary" @click="toRegister">确认</view>
                </view>
            </view>
        </view>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
import {mapState } from 'vuex';  
export default {
    
    computed: {
    	...mapState(['shotId'])
    },
	data() {
		return {
			phone: '',
            yzm :false,
            jsyzm : false,
			password: '',
			invcode: '',
			authcode: '1234',
			logining: false,
            djs: 60,
            isRegister : false,
            promptVisible :false,
		};
	},
	onLoad() {
    },
	methods: {
		input(e){
			this.invcode = e.detail.value;
		},
		...mapActions(['register','login']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.navigateBack();
		},
        getyzm(){
          if(!this.yzm){
              if(this.phone==""){
                    this.$api.msg('请输入手机号码!');
                    return;
              }
              this.$_get("app_sms/get",{phone : this.phone}).then(res => {
                this.$api.msg(res.msg);
                if(res.flag){
                    this.yzm=true;
                    this.jsyzm = true;
                    this.isRegister =  res.register;
                }else{
                }
              }).catch(res=>{
                  this.$api.msg("请求失败!"); 
              });
              
          }
        },
		tolR() {
            if(!this.jsyzm){
				this.$api.msg('请接接收证码!');
                return;
            }
            if(this.isRegister){//登录
                this.logining = true;
                this.login({phone: this.phone,code: this.authcode}).then(res => {
                    this.logining = false;
                    this.$api.msg('登录成功');
                    setTimeout(()=>{
                        uni.navigateBack();
                    }, 200)
                }).catch(res=>{
                    this.logining = false;
                    this.$api.msg(res.msg);
                });
            }else{//输入验证码 注册
                if(this.shotId!=null&& this.shotId != ""){
                    this.invcode = this.shotId;
                    this.toRegister(true);
                }else{
                    this.promptVisible = true
                }
               
            }
		},
        toRegister(navToHome=false){
            this.logining = true;
            this.register({phone: this.phone,invcode: this.invcode,
            authcode: this.authcode})
            .then(res => {
                this.logining = false;
                this.$api.msg('注册成功');
                setTimeout(()=>{
					if(navToHome){
						uni.switchTab({
							url:"/pages/index/index"
						})
					}else{
						uni.navigateBack();
					}
                }, 200)
            }).catch(res=>{
                this.logining = false;
                this.$api.msg(res.msg);
            });
        },
		toLogin(){
			uni.redirectTo({
				url:"/pages/public/login"
			})
		},
	}
};
</script>

<style lang="scss">
.authcode{
    font-size: 40upx;
    .uni-mask{
        position: fixed;
        z-index: 999;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0,0,0,.6);
    }
    .uni-modal{
        position: fixed;
        z-index: 999;
        width: 80%;
        max-width: 300px;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        background-color: #fff;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
    }
    .uni-modal__hd{
        padding: 20upx ;
    }
    .uni-modal__bd{
        padding: 40upx;
    }
    .uni-modal__ft{
       position: relative;
       line-height: 48px;
       font-size: 18px;
       display: -webkit-box;
       display: -webkit-flex;
       display: flex;
    }
    .uni-modal__btn{
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        color: #3cc51f;
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        position: relative;
    }
    .uni-modal__btn_default{
        color: #000;
        border-right: 1px solid #d5d5d6;
    }
    .uni-modal__ft:after {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
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
}
.wrapper {
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
.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	left: 50upx;
	top: -60upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	padding: 0 30upx;
	background: $page-color-light;
	height: 120upx;
	border-radius: 4px;
	margin-bottom: 50upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		height: 50upx;
		line-height: 56upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}
	input {
		height: 60upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		width: 100%;
	}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	border-radius: 50px;
	margin-top: 70upx;
	background: #53a5ff;
	color: #fff;
	font-size: $font-lg;
	&:after {
		border-radius: 100px;
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
.yzm{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    button{
        color: #fff;
        background: rgb(227,20,54);
        font-size: 24upx;
        height: 80upx;
        margin-top: 20upx;
    }
    .noclick{
        color: #ccc;
        background: rgb(246,246,246);
    }
}
</style>
