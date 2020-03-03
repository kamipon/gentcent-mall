<template>
	<view class="content">
		<scroll-view 
			class="list-scroll-content" 
			scroll-y
			@scrolltolower="loadData"
		>
			<!-- 空白页 -->
			<empty v-if="loaded === true && couponList.length === 0"></empty>
			<view v-for="(item,index) in couponList" :key="index"
				class="order-item mask">
				<view class="mask-content" @click.stop.prevent="stopPrevent">
					<!-- 优惠券页面，仿mt -->
					<view class="coupon-item"  @click="toPDD(item)">
						<view class="con">
							<view class="left">
								<text class="title">{{item.goodsName}}</text>
								<text class="time">创建时间{{item.addTime/1000|dateFormat}}</text>
							</view>
							<view class="right">
								<text class="price">{{item.money/100}}</text>
								<text></text>
							</view>
							
							<view class="circle l"></view>
							<view class="circle r"></view>
						</view>
						<text class="tips">点击跳转拼多多</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
			
		</scroll-view>
	</view>
</template> 
<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				couponList : [],
				loadingType: 'more',
                loaded : false,
                pageIndex : 1,
			};
		},
		
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			this.loadData()
			
		},
		 
		methods: {
            toPDD(item){
				//#ifdef MP
				uni.navigateToMiniProgram({
					appId:item.pddWeAppAppId,
					path:item.weAppUrl
				})
				//#endif
				//#ifndef MP
				this.$store.state.webviewSrc = item.webUrl ;
				uni.navigateTo({
				    url: `/pages/webview/webview`
				})
				//#endif
				
               
            },
			//获取订单列表
			loadData(source){
				//这里是将订单挂载到tab列表下
				let navItem = this.couponList;
				if(this.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				this.loadingType = 'loading';
					// let orderList = Json.orderList.filter(item=>{
					// 	//添加不同状态下订单的表现形式
					// 	item = Object.assign(item, this.orderStateExp(item.state));
					// 	//演示数据所以自己进行状态筛选
					// 	if(state === 0){
					// 		//0为全部订单
					// 		return item;
					// 	}
					// 	return item.state === state
					// });
                    this.$_get("app_coupon/list",{
                        pageIndex : this.pageIndex},{auth: true}).then(res => {
                        for (let var1 of   res.couponList) {
                            this.couponList.push(var1)
                        };
                        console.log(this.couponList)
                        //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
                        this.$set(navItem, 'loaded', true);
                        //判断是否还有数据， 有改为 more， 没有改为noMore 
                            
                        if(res.total>10*this.pageIndex){
                            this.loadingType = 'more';
                        }else{
                            this.loadingType = 'noMor';
                        }
                        this.pageIndex+=1;
                    })
			}, 
		},
        filters:{
            price(val){
                return val/100
            },
            dateFormat(val){
                function timeAdd0(str) {
                    if (str < 10) {
                        str = '0' + str;
                    }
                    return str
                }
                var time = new Date(val*1000);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) ;

            }            
        }
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
    /* 优惠券列表 */
    .coupon-item{
    	display: flex;
    	flex-direction: column;
    	margin: 20upx 24upx;
    	background: #fff;
    	.con{
    		display: flex;
    		align-items: center;
    		position: relative;
    		height: 120upx;
    		padding: 0 30upx;
    		&:after{
    			position: absolute;
    			left: 0;
    			bottom: 0;
    			content: '';
    			width: 100%;
    			height: 0;
    			border-bottom: 1px dashed #f3f3f3;
    			transform: scaleY(50%);
    		}
    	}
    	.left{
    		display: flex;
    		flex-direction: column;
    		justify-content: center;
    		flex: 1;
    		overflow: hidden;
    		height: 100upx;
    	}
    	.title{
    		font-size: 32upx;
    		color: $font-color-dark;
    		margin-bottom: 10upx;
            white-space:nowrap;
            text-overflow:ellipsis;
            -webkit-text-overflow:ellipsis;
            overflow:hidden;
    	}
    	.time{
    		font-size: 24upx;
    		color: $font-color-light;
    	}
    	.right{
    		display: flex;
    		flex-direction: column;
    		justify-content: center;
    		align-items: center;
    		font-size: 26upx;
    		color: $font-color-base;
    		height: 100upx;
    	}
    	.price{
    		font-size: 44upx;
    		color: $base-color;
    		&:before{
    			content: '￥';
    			font-size: 34upx;
    		}
    	}
    	.tips{
    		font-size: 24upx;
    		color: $font-color-light;
    		line-height: 60upx;
    		padding-left: 30upx;
    	}
    	.circle{
    		position: absolute;
    		left: -6upx;
    		bottom: -10upx;
    		z-index: 10;
    		width: 20upx;
    		height: 20upx;
    		background: #f3f3f3;
    		border-radius: 100px;
    		&.r{
    			left: auto;
    			right: -6upx;
    		}
    	}
    }
    .mask{
    	background: rgba(0,0,0,0);
    	
    }
</style>
