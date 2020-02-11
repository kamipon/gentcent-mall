<template>
	<view class="content">
		<view class="shop">
		    <view class="img">
		        <img src="https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg"></image>
		    </view>
		    <view class="shop-tet">
		        <view class="t1" >
		            <text class="name">北极绒专门店</text>
		        </view>
		        <view class="zs">天猫logo</view>
		    </view>
		</view>
		<view class="shop-score">
		    
		    <view class="score"><text>宝贝描述:</text><text class="num">4.9</text><text class="icon">高</text></view>
		    <view class="score">卖家服务:<text class="num">4.9</text><text class="icon">高</text></view>
		    <view class="score">物流服务:<text class="num">4.9</text><text class="icon">高</text></view>
		</view>
        <view class="goods-list">
            
            <view 
            	v-for="(item, index) in goodsList" :key="index"
            	class="goods-item"
            	@click="navToDetailPage(item)"
            >
            	<view class="image-wrapper">
            		<img :src="item.image" mode="aspectFill"></img>
            	</view>
                <view class="date">
                    
                    <view class="title ">
                        <text class="text">{{item.title}}{{item.title}}{{item.title}}</text>
                    </view>
                    <view class="price-box t1">
                    	<text>原价:￥69</text>
                    	<text>已售<text class="num">{{item.sales}}</text>件</text>
                    </view>
                    <view class="price-box t2">
                    	<text class="price">券后 ￥<text class="num">{{item.price}}</text></text>
                    	<text class="ticket">
                            <view class="quan left"></view>
                            <view class="quan right"></view>
                            20元券</text>
                    </view>
                </view>
            </view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		
		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.name}}</view>
						<view 
							v-for="tItem in item.child" :key="tItem.id" 
							class="cate-item b-b" 
							:class="{active: tItem.id==cateId}"
							@click="changeCate(tItem)">
							{{tItem.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition:"fixed",
				headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: []
			};
		},
		
		onLoad(options){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.cateId = options.tid;
			this.loadCateList(options.fid,options.sid);
			this.loadData();
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		methods: {
			//加载分类
			async loadCateList(fid, sid){
				let list = await this.$api.json('cateList');
				let cateList = list.filter(item=>item.pid == fid);
				
				cateList.forEach(item=>{
					let tempList = list.filter(val=>val.pid == item.id);
					item.child = tempList;
				})
				this.cateList = cateList;
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				
				let goodsList = await this.$api.json('goodsList');
				if(type === 'refresh'){
					this.goodsList = [];
				}
				//筛选，测试数据直接前端筛选了
				if(this.filterIndex === 1){
					goodsList.sort((a,b)=>b.sales - a.sales)
				}
				if(this.filterIndex === 2){
					goodsList.sort((a,b)=>{
						if(this.priceOrder == 1){
							return a.price - b.price;
						}
						return b.price - a.price;
					})
				}
				
				this.goodsList = this.goodsList.concat(goodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType  = this.goodsList.length > 20 ? 'nomore' : 'more';
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index){
				if(this.filterIndex === index && index !== 2){
					return;
				}
				this.filterIndex = index;
				if(index === 2){
					this.priceOrder = this.priceOrder === 1 ? 2: 1;
				}else{
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示分类面板
			toggleCateMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(()=>{
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item){
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToDetailPage(item){
				//测试数据没有写id，用title代替
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
    
	page, .content{
		background: $page-color-base;
	}
	.content{
	}
	/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}
    .goods-list{
        margin-top: 10upx;
        .goods-item{
            background-color: #fff;
            display: flex;
            width: 100%;
            padding: 30upx;
            .image-wrapper{
                width: 250upx;
                border-radius:10upx ;
                img{
                    width: 250upx; 
                    height: 250upx;
                    border-radius:10upx ; 
                }
            }
            .date{
                width:440upx;
                padding-left: 40upx;
                .title{
                    font-size: 30upx;
                    height: 150upx;
                    padding-bottom: 80upx;
                    .text{
                    
                        text-overflow: -o-ellipsis-lastline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }    
                }
                .price-box{
                    height: 50upx;  
                    line-height: 50upx;
                    font-size: 18upx;
                    display: flex;
                    justify-content:space-between;
                }  
                .t1{
                    color: #C0C4CC;
                    .num{
                        padding: 3upx;
                    }
                }
                .t2{
                    color: red;
                    .num{
                        font-size: 36upx;
                    }
                    .ticket{
                        position: relative;
                        background-image: linear-gradient(to right, #ff9b87 , #ff6f6f);
                        color: #fff;
                        padding: 0 30upx;
                        border-radius:10upx ;
                        .quan{
                            background-color: #fff;
                            width: 10upx;
                            height:10upx;
                            border-radius:10upx;
                        }
                        .left{
                            position:absolute;
                            top:50%; 
                            left:0;
                            transform:translate(-50%,-50%);
                        }
                        .right{
                            position:absolute;
                            top:50%; 
                            right:0;
                            transform:translate(+50%,-50%);
                        }
                        
                        
                    }
                    // .ticket:before {
                    //     content: "";
                    //     position: absolute;
                    //     left: -.66rem;
                    //     width: 2.4rem;
                    //     height: 2.8rem;
                    //     top: 50%;
                    //     -webkit-transform: translate(-30%,-50%);
                    //     transform: translate(-30%,-50%);
                    //     -webkit-box-shadow: 3px 0 0 #aeadad;
                    //     box-shadow: 3px 0 0 #aeadad;
                    //     -webkit-border-radius: 80%;
                    //     border-radius: 80%;
                    //     background-color: #f5f5f5;
                    // }
                }
                
            }
        }
    }
    
	/* 商品列表 */
	// .goods-list{
 //        margin-top: 15upx;
	// 	display:flex;
	// 	flex-wrap:wrap;
	// 	padding: 0 30upx;
	// 	background: #fff;
	// 	.goods-item{
	// 		display:flex;
	// 		flex-direction: column;
	// 		width: 48%;
	// 		padding-bottom: 40upx;
	// 		&:nth-child(2n+1){
	// 			margin-right: 4%;
	// 		}
	// 	}
	// 	.image-wrapper{
	// 		width: 100%;
	// 		height: 330upx;
	// 		border-radius: 3px;
	// 		overflow: hidden;
	// 		image{
	// 			width: 100%;
	// 			height: 100%;
	// 			opacity: 1;
	// 		}
	// 	}
	// 	.title{
	// 		font-size: $font-lg;
	// 		color: $font-color-dark;
	// 		line-height: 80upx;
	// 	}
	// 	.price-box{
	// 		display: flex;
	// 		align-items: center;
	// 		justify-content: space-between;
	// 		padding-right: 10upx;
	// 		font-size: 24upx;
	// 		color: $font-color-light;
	// 	}
	// 	.price{
	// 		font-size: $font-lg;
	// 		color: $uni-color-primary;
	// 		line-height: 1;
	// 		&:before{
	// 			content: '￥';
	// 			font-size: 26upx;
	// 		}
	// 	}
	// }
    .shop{
        display: flex;
        margin-top: 0;
        background-color: #fff;
        padding: 20upx 30upx;
        .img{
            width: 120upx;
            img{
                width: 120upx;
                height: 120upx;
                border-radius: 5upx;
            }
         }
         .shop-tet{
            margin-left: 20upx;
            width:630upx;
            padding: 0px 10upx ;
            font-size: 30upx;
            align-items: center;
            .t1{
                display: flex;
                align-items: center;
                .name{
                    line-height: 60upx;
                    height: 60upx;
                    font-weight: 500;
                    flex: 3;
                }
            }
            .zs{
                color: rgb(169,169,169);
                line-height: 60upx;
                height: 60upx;
                font-size: 16upx;
                .num{
                    color: red;
                    padding: 0 5upx;
                }
            }
        }
    }
	.shop-score{
	    display: flex;
	    background-color: #fff;
	    margin-top: 2upx;
	    font-size: 24upx;
	    line-height: 24upx;
	    padding: 30upx 0upx ;
	    color: rgb(169,169,169);
	        
	    .score{
	        
	        text-align: center;
	        width: 200upx;
	        
	        align-items: center;
	        flex: 1;
	        text-align: center;
	        .num{
	            padding: 0 3upx;
	        }
	        .icon{
	            font-size: 18upx;
	            line-height: 24upx;
	            background-color: rgb(240,240,240);
	            padding: 3upx;
	            margin-left: 5upx;
	        }
	    }
	}

</style>
