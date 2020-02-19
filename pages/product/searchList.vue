<template>
	<view class="content">
        <view class="keyword">
            <view class="search">
                <input maxlength="20"  type="text" :value="keyword"
                confirm-type="search" @click="navTosearch(keyword)"
                 placeholder="关键词搜索"/>
                <image src="../../static/zy-search/search.svg" 
                mode="aspectFit" @click="navTosearch(keyword)" class="search-icon"></image>
                
            </view>
        </view>
		<view class="navbar" >
			
           
            <view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
		</view>
		<view class="goods-list">
		    
		    <view 
		    	v-for="(item, index) in goodsList" :key="index"
		    	class="goods-item"
		    	@click="navToDetailPage(item)"
		    >
		    	<view class="image-wrapper">
		    		<img :src="item.goods_image_url" mode="aspectFill"></img>
		    	</view>
		        <view class="date">
		            
		            <view class="title ">
		                <text class="text">{{item.goods_name}}</text>
		            </view>
		            <view class="price-box t1">
		            	<text class="yj">￥{{item.min_group_price | price}}</text>
		            	<text class="yx">已销<text class="num">{{item.sales_tip}}</text></text>
		            </view>
		            <view class="price-box t2">
		            	<text class="price">券后 <text class="num">{{item.min_group_price - item.coupon_discount | price}}</text></text>
		            </view>
                    <view class="ticket ">
                    	<text class="quan">
                            <text class="lq">领券</text>
                            <text class="num">立减{{item.coupon_discount | price}}元</text>
                        </text>
                    </view>
		        </view>
		    </view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
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
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
                keyword : "",
                catId: "",
                pageIndex : 1,
                sortType : 0,
			};
		},
		
		onLoad(options){
            if(options.keyword){
                this.keyword = options.keyword;
            }
            if(options.catId){
                this.catId = options.catId;
            }
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
			navTosearch(v){
                uni.navigateTo({
                	url: `/pages/search/search?keyword=${v}`
                });
            },
            navToBack(){
               history.back();
            },
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
                this.$_get("app_goods/search",
                    {keyword: this.keyword,
                    pageIndex:this.pageIndex,
                    catId : this.catId,
                    sortType : this.sortType}).then(res => {
                    this.pageIndex+=1;
                    //获取数据
                    let goodsList = res.goods_search_response.goods_list;
                    
                    if(type === 'refresh'){
                    	console.log('refresh')
                    	console.log(this.sortType)
                        this.goodsList = [];
                    }
                    
                    this.goodsList = this.goodsList.concat(goodsList);
                    
                    //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
                    this.loadingType  =this.pageIndex*10>res.goods_search_response.total_count ? 'nomore' : 'more';
                    
                    if(type === 'refresh'){
                    	if(loading == 1){
                    		uni.hideLoading()
                    	}else{
                    		uni.stopPullDownRefresh();
                    	}
                    }
                });
				
			},
			//筛选点击
			tabClick(index){
                this.pageIndex = 1 ;
				if(this.filterIndex === index && index !== 2){
					return;
				}
                if(index==0){
                    this.sortType=0;
                }else if(index==1){
                    this.sortType=5;
                }else if(index==2){
                    if(this.sortType==4){
                        this.sortType=3
                    }else{
                        this.sortType=4
                    }
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
			//详情
			navToDetailPage(item){
				//测试数据没有写id，用title代替
				let id = item.goods_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){}
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
	}
	.content{
		padding-top: 145upx;
	}
    .keyword{
        position: fixed;
        left: 0;
        top: var(--window-top);
        display: flex;
        width: 100%;
        height: 60upx;
        background: #fff;
        padding: 10upx 20upx;
        .search{
            margin-left: 10upx;
            input{
            	background-color: #F7F7F7;
            	padding: 10upx 40upx;
            	font-size: 28upx;
                height: 50upx;
                width: 700upx;
            	border-radius: 50upx;
            }
            .search-icon{
                margin-top: 10upx;
            	width: 40upx;
            	height: 40upx;
            	padding: 2upx 2upx 2upx 0;
            	position: absolute;
            	right: 0;
            	top: 5upx;
            	right: 40upx;
            	z-index: 10;
            }
        }
    }
	.navbar{
		position: fixed;
		left: 0;
		top: 180upx;
        top: calc(var(--window-top) + env(safe-area-inset-top) + 60upx);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 0px 1upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
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

	/* 商品列表 */
	// .goods-list{
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
    .goods-list{
        margin-top: 0upx;
        .goods-item{
            background-color: #fff;
            display: flex;
            width: 100%;
            padding: 7upx;
            border-bottom:1upx solid rgb(244,244,244);
            .image-wrapper{
                width: 250upx;
                img{
                    width: 250upx; 
                    height: 250upx;
                }
            }
            .date{
                padding: 0 15upx;
                .title{
                    font-size: 30upx;
                    height: 90upx;
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
                    line-height: 50upx;
                    font-size: 18upx;
                    display: flex;
                }  
                .t1{
                    height: 40upx;  
                    color: #C0C4CC;
                    .yj{
                        text-decoration: line-through;
                    }
                    .yx{
                        padding-left: 10upx;
                    }
                    .num{
                        padding:  0 3upx;
                    }
                }
                .t2{
                    height: 60upx; 
                    color: #C0C4CC;
                    line-height: 70upx;
                    .num{
                        color: #000;
                        font-size: 36upx;
                        &:before {
                            content: '\FFE5';
                            font-size: 20upx;
                            padding-left: 5upx;
                        }
                    }
                }
                .ticket{
                    .quan{
                        height: 30upx;
                        line-height: 30upx;
                        font-size: 20upx;
                        color: red;
                        .lq{
                            padding: 0 2upx;
                            background-color: red;
                            color: #fff;
                            border:1upx solid red;
                            border-radius:5upx 0  0upx 5upx;
                        }
                        .num{
                            border:1upx solid red;
                            padding: 0 2upx;
                            border-radius: 0 5upx 5upx 0;
                        }
                    }
                }
                
            }
        }
    }
	

</style>
