<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
                        @touchstart="gotouchstart(index)"
                        @touchmove="gotouchmove"
                        @touchend="gotouchend"
					>
						
						<view class="img" @click="navTo('/pages/product/product?id='+item.goods_id)">
							<image :src="item.goods_pic" 
							></image>
						</view>
						<view class="item-right">
							<text class=" title" @click="navTo('/pages/product/product?id='+item.goods_id)">{{item.goods_name}}</text>
							<text class="attr">原价：¥{{item.min_normal_price}}</text>
							<text class="price">券后价：¥{{item.min_group_price}}</text>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
		</view>
		
		<!-- 为您精选 -->
		<view class="f-header m-t">
			<view class="tit-box">— 为您精选 —</view>
		</view>
		<view class="guess-section">
			<view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
				<view class="image-wrapper"><image :src="item.goodsThumbnailUrl" mode="aspectFill" lazy-load fade-show></image></view>
				<text class="title clamp2">{{ item.goodsName }}</text>
				<text class="price">
					￥{{ ((item.minGroupPrice - item.couponDiscount) / 100) | toFiexd }}
					<text class="discount-price">￥{{ (item.minGroupPrice / 100) | toFiexd }}</text>
				</text>
				<text class="sales-volume">
					已售
					<text class="num">{{ item.salesTip }}</text>
				</text>
				<text class="coupon">
					<text class="coupon-discount">{{ item.couponDiscount / 100 }}元券</text>
					<text class="coupon-remain">剩{{ item.couponRemainQuantity }}张</text>
				</text>
			</view>
			<view class="load-all-text">— 已全部加载 —</view>
		</view>
		
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
                timeOutEvent : 0,//长按定时器
				goodsList:[]
			};
		},
		onLoad(){
			this.loadGoodsData();
		},
        onShow() {
            this.loadData();
        },
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			},
            hasLogin(val, oldVal) {
                this.loadData();
            }
		},
		computed:{
			...mapState(['hasLogin'])
		},
		filters: {
			toFiexd(num, pre = 2) {
				return parseFloat(num).toFixed(pre);
			}
		},
		methods: {
			loadGoodsData() {
				Math.random()
				this.$_get('app_index/goods/search', { pageIndex: Math.floor(Math.random() * Math.floor(10)), pageSize: 14 }, { loading: false }).then(res => {
					this.goodsList = this.goodsList.concat(res.data.goodsSearchResponse.goodsList);
				});
			},
            navTo(url){
            	uni.navigateTo({  
            		url
            	})  
            }, 
			//请求数据
			loadData(){
                if(this.hasLogin){
                    this.$_get("app_favorites/list",{},{auth: true,loading: true}).then(res => {
						if(res.goods_basic_detail_response){
							this.cartList = res.goods_basic_detail_response.goods_list;;
							console.log(this.cartList)
						}else{
							this.cartList = [];
						}
                    })
                }
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
            gotouchstart(index){
               
               let that = this;
               clearTimeout(this.timeOutEvent);//清除定时器
               this.timeOutEvent = 0;
               this.timeOutEvent = setTimeout(()=>{
                    //执行长按要执行的内容，
                    this.deleteCartItem(index);
                 },600);//这里设置定时
             },
                  //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
            gotouchend(){
                clearTimeout(this.timeOutEvent);
                  if(this.timeOutEvent!=0){
                    //这里写要执行的内容（尤如onclick事件）
                 }
            },
            //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 
            gotouchmove(){
                 clearTimeout(this.timeOutEvent);//清除定时器
                 this.timeOutEvent = 0;
            },
			//删除
			deleteCartItem(index){
                uni.showModal({
                    title: '提示',
                    content: '确认删除改商品吗?',
                    success:  (res)=> {
                        if (res.confirm) {
                            let list = this.cartList;
                            let row = list[index];
                            let id = row.goods_id;
                            this.$_get("app_favorites/remove",{id: id},{auth: true}).then(res => {
                            })
                            this.cartList.splice(index, 1);
                            uni.hideLoading();
                        } else if (res.cancel) {
                        }
                    }
                });
				
			},
		}
	}
</script>

<style lang='scss'>
	.load-all-text{
		width: 100%;
		padding: 20upx 0;
		font-size: 26upx;
		text-align: center;
		color: $font-color-grey;
	}
	.container{
		background-color: #f5f5f5;
		/* 空白页 */
		.empty{
			width: 100%;
			min-height: 400upx;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		background-color: #FFFFFF;
        .img{
            width: 230upx;
            height: 230upx;
			image{
                width: 100%;
                height: 100%;
				border-radius:8upx;
			}
        }
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
                margin-top: 50upx;
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
                text-decoration: line-through;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
				color:$font-color-red
			}
            
            .title{
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
            	height: 80upx;
                -webkit-box-orient: vertical;
            }
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20upx;
		background: $backg-color-grey;
		.guess-item {
			margin-top: 16upx;
			background: #fff;
			display: flex;
			flex-direction: column;
			width: 49%;
			padding-bottom: 20upx;
			&:nth-child(2n + 1) {
				margin-right: 2%;
			}
		}
		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title {
			font-size: 26upx;
			color: $font-color-dark;
			line-height: 38upx;
			width: 100%;
			padding: 18upx 18upx 20upx 18upx;
			height: 96upx;
		}
		.price {
			margin-top: 10upx;
			font-size: 36upx;
			color: $font-color-red;
			line-height: 1;
			font-weight: 600;
			margin-left: 16upx;
			.discount-price {
				font-size: 24upx;
				color: $font-color-grey;
				line-height: 1;
				margin-left: 10upx;
				font-weight: 400;
				text-decoration: line-through;
			}
		}
		.sales-volume {
			font-size: 24upx;
			margin-top: 14upx;
			margin-left: 18upx;
			color: $font-color-grey;
			.num {
				margin-left: 8upx;
			}
		}
		.coupon {
			font-size: 22upx;
			margin-top: 20upx;
			margin-left: 18upx;
			border-radius: 4upx;
			border: 2upx solid $font-color-red;
			align-self: flex-start;
		}
	
		.coupon-discount {
			color: #f5f5f5;
			background-color: $font-color-red;
			padding: 0 4upx;
		}
	
		.coupon-remain {
			background-color: #fff;
			color: $font-color-red;
			padding: 0 4upx;
		}
	}
	.f-header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70upx;
		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 30upx;
			color: $font-color-grey;
		}
	}
</style>
