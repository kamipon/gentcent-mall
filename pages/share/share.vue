<template>
	<view class="content b-t">
        <view class="yqm">我的邀请码 :  {{userInfo.shotId}}</view>
        <canvas canvas-id="qrcode" style="width: 155px;height: 155px;margin: 0 50%;transform: translate(-50%, 0%);" />
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			<text style="margin-right: 10px;">推广链接: </text>{{url}}
		</text>
		<button class="add-btn" @click="fzlj()">复制链接</button>
        <view class="gz">
            <view>推广规则:</view>
            <view>1. [被推广好友] 注册登录后获得 0 积分</view>
            <view>2. [邀请人] 好友注册app后获得 0 积分</view>
        </view>
	</view>
</template>

<script>
    import {mapActions } from 'vuex'; 
    import {mapState } from 'vuex';  
    import uQRCode from '@/js/uqrcode.js' //二维码
    import h5Copy  from '@/js/junyi-h5-copy.js' //控制剪切板
	export default {
        computed: {
        	...mapState(['hasLogin','userInfo',"domainName"])
        },
		data() {
			return {
                qr : "",
                url : "",
            }
		},
		onLoad(option){
            let shotId = option.shotId;
            if(shotId){//被推广过来的
                if(this.hasLogin){
                    //登录的去首页
                    uni.switchTab({
                    	url: '/pages/index/index'
                    })
                }else{
                    //设置  shotId
                    uni.redirectTo({
                    	url: '/pages/public/login',
						success: () => {
							this.setShotId(shotId)
						}
                    })
                }
            }
            //没登录去登录
            this.getUrl();
		},
		methods: {
			...mapActions(['setShotId']),
            fzlj(){
                let content = 'H5复制插件' // 复制内容，必须字符串，数字需要转换为字符串
               const result = h5Copy(this.url)
               if (result === true) {
                 uni.showToast({
                   title:'复制成功',
                 })
               } else {
                 uni.showToast({
                   title:'复制失败,请手动操作',
                   icon:'none'
                 })
               }
            },
            getUrl(){
                this.url = this.domainName+`web/pages/index/index?shotId=${this.userInfo.shotId}`
                this.getQr();
            },
            getQr(){
                uQRCode.make({
                    canvasId: 'qrcode',
                    componentInstance: this,
                    text: this.url,
                    size: 155,
                    margin: 10,
                    backgroundColor: '#f5f5f5',
                    foregroundColor: '#000000',
                    fileType: 'png',
                    correctLevel: uQRCode.defaults.correctLevel,
                    success: res => {
                        this.qrUrl = res;
                    }
                })
            }
			
		}
	}
</script>

<style lang='scss'>
    
	page{
		padding-bottom: 120upx;
        background: #f5f5f5;
	}
	.content{
		position: relative;
        font-size: 24upx;
	}
    .yqm{
        font-size: 44upx;
        text-align: center;
        padding: 10upx 0;
    }
	.gz{
        padding: 20upx 20upx;
    }
</style>
