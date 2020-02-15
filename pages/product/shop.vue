<template>
	<view class="content">
		<view class="shop">
		    <view class="img">
		        <img :src="shop.img_url"></image>
		    </view>
		    <view class="shop-tet">
		        <view class="t1" >
		            <text class="name">{{shop.mall_name}}</text>
		        </view>
		        <view class="zs">天猫logo</view>
		    </view>
		</view>
		<view class="shop-score">
		    
            <view class="score"><text>宝贝描述:</text><text class="num"></text><text class="icon">{{shop.desc_txt}}</text></view>
		    <view class="score">卖家服务:<text class="num"></text><text class="icon">{{shop.serv_txt}}</text></view>
		    <view class="score">物流服务:<text class="num"></text><text class="icon">{{shop.lgst_txt}}</text></view>
		</view>
        <view class="goods-list">
            
            <view 
            	v-for="(item, index) in goodsList" :key="index"
            	class="goods-item"
            	@click="navToDetailPage(item.goods_id)"
            >
            	<view class="image-wrapper">
            		<img :src="item.goods_thumbnail_url" mode="aspectFill"></img>
            	</view>
                <view class="date">
                    
                    <view class="title ">
                        <text class="text">{{item.goods_name}}</text>
                    </view>
                    <view class="price-box t1">
                    	<text>原价:￥{{item.min_normal_price| price}}</text>
                    	<text>已售<text class="num">{{item.sales_tip}}</text>件</text>
                    </view>
                    <view class="price-box t2">
                    	<text class="price">券后 ￥<text class="num">{{item.min_normal_price -item.coupon_discount | price }}</text></text>
                    	<text class="ticket">
                            <view class="quan left"></view>
                            <view class="quan right"></view>
                            {{item.coupon_discount | price}}元券</text>
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
				headerPosition:"fixed",
				headerTop:"0px",
				loadingType: 'more', //加载更多状态
				shopId: "", //已选三级分类id
				goodsList: [],
                shop : {},
			};
		},
		
		onLoad(options){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.shopId = options.id;
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
            getShopDeta(){
                uni.request({
                    url: this.websiteUrl+'/app_shop/detail', 
                    data: {
                        id: this.shopId
                    },
                    success: (res) => {
                        this.shop=res.data.merchant_list_response.mall_search_info_vo_list[0];
                        
                        this.goodsList= this.shop.goods_detail_vo_list;
                        console.log( this.goodsList)
                        this.loadingType='nomore';
                    }
                });
            },
            navToDetailPage(goodsId){
                uni.navigateTo({
                    url: `/pages/product/product?id=${goodsId}`
                })
            },
			//加载分类
			async loadCateList(fid, sid){
			},
			//加载商品 ，带下拉刷新和上滑加载
			loadData(type='add', loading) {
				console.log("123")
				console.log(this.loadingType)
                //没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
                    this.getShopDeta()
				}else{
					location.reload();
                    return;
				}
				
				let goodsList =  this.$api.json('goodsList');
				if(type === 'refresh'){
					this.goodsList = [];
				}
				goodsList.sort((a,b)=>b.sales - a.sales)
				
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType= this.goodsList.length > 20 ? 'nomore' : 'more';
                if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
            getOtp(){
                uni.request({
                    url: this.websiteUrl+'/app_goods/opt', 
                    data: {
                        ids: this.opt_ids
                    },
                    success: (res) => {
                        console.log("33333")
                        console.log(res.data.goods_search_response.goods_list);
                        this.tjGoodsList2 = res.data.goods_search_response.goods_list;
                    }
                });
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
