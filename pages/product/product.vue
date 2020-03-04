<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="item.src" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<view class="price-box">
				<text class=""></text>
				<text class="price-tip">券后价 ¥ </text>
				<text class="price">{{goodsDeta.min_group_price-goodsDeta.coupon_discount | price }}</text>
                
				
                <!-- <view class="rewards" >预估积分:+9909</view> -->
				
			</view>
            <view class="m-price">
				<text>原价</text> <text class="num">¥{{goodsDeta.min_group_price |price}}</text>
            </view>
			<text class="title">{{goodsDeta.goods_name}}</text>
			<view class="bot-row">
				
				<text class="sales">已售 <text class="num red">{{goodsDeta.sales_tip}}</text> 件</text>
			</view>
		</view>
        <view class="coupon">
            <view class="ticket">
                <view class="ex">
                    <view class="text"><text class="num">{{(goodsDeta.coupon_discount)| price}}</text>元优惠券</view>
                    <view class="date">
                        使用期限: {{goodsDeta.coupon_start_time | dateFormat }} 
                    - {{goodsDeta.coupon_end_time | dateFormat }}</view>
                </view>
                
                <view class="button" @click="buy">立即领取</view>
            </view>
            <view class="description"></view>
        </view>
		
		<!-- 评价 -->
		<!-- <view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(1.5w+)</text>
				<text class="tip">查看全部
				<text class="yticon icon-you"></text></text>
			</view> 
			<view class="eva-box">
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					
				</view>
			</view>
		</view> -->
        <!-- 商店信息-->
		<view class="shop" v-if="shop">
            <view class="img">
                <img :src="shop.img_url"></image>
            </view>
            <view class="shop-tet">
                <view class="t1" >
                    <text class="name">{{shop.mall_name}}</text>
                    
                    <text class="all" @click="navToShop(shop.mall_id)">进店逛逛</text>
                </view>
                <view class="zs">在售优惠商品<text class="num" v-if="shop.goods_detail_vo_list">{{shop.goods_detail_vo_list.length}}</text>件</view>
            </view>
        </view>
        
        <view class="shop-score" v-if="shop">
            <view class="score"><text>宝贝描述:</text><text class="num"></text><text class="icon">{{goodsDeta.desc_txt}}</text></view>
            <view class="score">卖家服务:<text class="num"></text><text class="icon">{{goodsDeta.serv_txt}}</text></view>
            <view class="score">物流服务:<text class="num"></text><text class="icon">{{goodsDeta.lgst_txt}}</text></view>
        </view>
        <!--相似推荐 -->
        <view class="seckill-section m-t">
        	<view class="s-header">
                相似推荐
        	</view>
        	<scroll-view class="floor-list" scroll-x>
        		<view class="scoll-wrapper">
        			<view 
        				v-for="(item, index) in tjGoodsList2" :key="index"
        				class="floor-item"
        				@click="navToDetailPage(item.goods_id)"
                        
                        v-show="item.goods_id!=goodsDeta.goods_id"
        			>
        				<image :src="item.goods_thumbnail_url" mode="aspectFill"></image>
        				<text class="title clamp">{{item.goods_name}}</text>
                        <view class="ticket">
                            <text class="tt">
                            <view class="icon">券</view>
                        	<text class="num">{{item.coupon_discount| price}}元</text>
                            </text>
                        </view>
        				<text class="quan">券后</text>
        				<text class="price">￥{{item.min_group_price - item.coupon_discount | price}}</text>
        			</view>
        		</view>
        	</scroll-view>
        </view>
        
		<view class="detail-desc">
			<view class="d-header">
				<text>商品详情</text>
			</view>
			
            <rich-text :nodes="goodsDeta.goods_desc"></rich-text>
		</view>
		
		<view class="detail-tj" v-show="false">
			<view class="d-header">
				<text>推荐商品</text>
			</view>
            <view class="goods-list">
                <view
                	v-for="(item, index) in tjGoodsList" :key="index"
                	class="goods-item"
                	@click="navToDetailPage(item)"
                >
                	<view class="image-wrapper">
                		<image :src="item.image" mode="aspectFill"></image>
                	</view>
                	<view class="text">
                        <text class="title clamp">{{item.title}}</text>
                        <view class="price-box">
                        	
                        	<text class="tex"><text class="price">{{item.price}}</text></text>
                        </view>
                        <view class="ticket">
                            <text class="tt">
                            <view class="icon">券</view>
                        	<text class="num">100元</text>
                            </text>
                        </view>
                        <view class="xl-pl">
                        	<text>已售 {{item.sales}} | 评论{{item.sales}} </text>
                        </view>
                    </view>
                </view>
                
            </view>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab"
             class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			
			
			<!-- <view class="action-btn-group">
				<button type="primary" class=" action-btn no-border add-cart-btn fx" @click="share">分享</button>
				<button type="primary" class=" action-btn no-border buy-now-btn gm"
                 @click="buy">￥{{(goodsDeta.coupon_discount)| price}} 领券</button>
			</view> -->
			<button class="action-btn-group2"  @click="buy">立即抢券</button>
		</view>
		
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import share from '@/components/share';
	export default{
		components: {
			share
		},
		data() {
			return {
				specClass: 'none',
				specSelected:[],
				tjGoodsList: [{
				    image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",
				    image2: "http://pic.rmb.bdstatic.com/819a044daa66718c2c40a48c1ba971e6.jpeg",
				    image3: "http://img001.hc360.cn/y5/M00/1B/45/wKhQUVYFE0uEZ7zVAAAAAMj3H1w418.jpg",
				    price: 179,
				    sales: 61,
				    title: "古黛妃 短袖t恤女夏装2019新款韩版宽松"}],
                    
                tjGoodsList2: [],
				favorite: false,
				shareList: [],
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
                goodsDeta:{},
                shopId : "",
                shop : {},
                opt_ids:"",
			};
		},
		onLoad(options){
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let id = options.id;
			if(id){
				//this.$api.msg(`点击了${id}`);
			}
            //获取商品详情
            this.$_get("app_goods/detail",{id: id}).then(res => {
				this.goodsDeta=res.goods_detail_response.goods_details[0];
				this.shopId = res.goods_detail_response.goods_details[0].mall_id;
				this.opt_ids = res.goods_detail_response.goods_details[0].opt_ids;
				this.getShopDeta()
				this.getOtp()
				
			});
            if(this.hasLogin){
                this.$_get("app_favorites/getState",{id: id},{auth: true}).then(res => {
                    console.log(res)
                    this.favorite = res ;
                });
            }
            // uni.request({
            //     url: this.websiteUrl+`/app_goods/detail`, 
            //     data: {
            //         id: id
            //     },
            //     success: (res) => {
            //        this.goodsDeta=res.data.goods_detail_response.goods_details[0];
            //        this.shopId = res.data.goods_detail_response.goods_details[0].mall_id;
            //        this.opt_ids = res.data.goods_detail_response.goods_details[0].opt_ids;
            //        this.getShopDeta()
            //        this.getOtp()
            //        console.log( this.shopId)
            //     }
            // });
            //获取数据
			//this.shareList = await this.$api.json('shareList');
		},
		methods:{
            getShopDeta(){
                this.$_get("app_shop/detail",{id: this.shopId}).then(res => {
                        this.shop=res.merchant_list_response.mall_search_info_vo_list[0];
                })
            },
            getOtp(){
                this.$_get("app_goods/opt",{ids: this.opt_ids}).then(res => {
                    this.tjGoodsList2 = res.goods_search_response.goods_list;
                })
            },
            navToShop(shopid){
				let id = shopid;
            	uni.navigateTo({
            		url: `/pages/product/shop?id=${id}`
            	})
            },
            navToDetailPage(goodsId){
                uni.navigateTo({
                    url: `/pages/product/product?id=${goodsId}`
                })
            },
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			//收藏
			toFavorite(){
				this.favorite = !this.favorite;
                if(this.favorite){
                    this.$_get("app_favorites/add",{id: this.goodsDeta.goods_id},{auth: true}).then(res => {
                    })
                }else{
                    this.$_get("app_favorites/remove",{id: this.goodsDeta.goods_id},{auth: true}).then(res => {
                    })
                }
			},
			buy(){
                
                if(this.hasLogin){
                    uni.showModal({
                        content: `确定使用${this.goodsDeta.coupon_discount}余额生成优惠券吗?`,
                        success: (e)=>{
                            if(e.confirm){
                                this.$_get("app_coupon/generate",{
                                    id: this.goodsDeta.goods_id,
                                    money: this.goodsDeta.coupon_discount,
                                    name: this.goodsDeta.goods_name
                                    },{auth: true}).then(res => {
										console.log(res);
                                        if(res.flag){
											//#ifdef MP
											uni.navigateToMiniProgram({
												appId:res.coupon.weAppInfoAppId,
												path:res.coupon.weAppInfoPagePath
											})
											//#endif
											//#ifndef MP
											this.$store.state.webviewSrc =res.coupon.webUrl ;
											uni.navigateTo({
											    url: `/pages/webview/webview`
											})
											//#endif
                                        }else{
                                            alert(res.msg)
                                        }
                                })
                            }
                        }
                    });
                }else{
                    uni.navigateTo({
                        url: '/pages/public/login'
                    })
                }
                
                
			},
			stopPrevent(){}
		},
        computed:{
            imgList : function(){
               let list =[];
               if(this.goodsDeta.goods_image_url){
                    for (let s of this.goodsDeta.goods_gallery_urls) {
                        list.push({src:s})
                    }
               }
               return list
            },
            ...mapState(['hasLogin','userInfo'])
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

<style lang='scss'>
    .shop{
        display: flex;
        margin-top: 16upx;
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
            width:630upx;
            padding: 0px 10upx ;
            font-size: 24upx;
            align-items: center;
            .t1{
                display: flex;
                align-items: center;
                .name{
                    line-height: 60upx;
                    height: 60upx;
                    font-weight: 600;
                    flex: 3;
                }
                .go{
                    border: 1upx solid rgb(255,37,75);
                    color: rgb(255,37,75);
                    line-height: 40upx;
                    padding:  0 1upx;
                    height: 40upx;
                    margin: 0 10upx;
                    font-size: 16upx;
                    text-align: center;
                    flex: 1;
                    border-radius: 20upx;
                }
                .all{
                    line-height: 40upx;
                    padding:  0 1upx;
                    height: 40upx;
                    background-color:rgb(255,37,75) ;
                    color: #fff;
                    margin: 0 10upx;
                    font-size: 24upx;
                    text-align: center;
                    flex: 1;
                    border-radius: 20upx;
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
            .icon{
                font-size: 18upx;
                line-height: 24upx;
                background-color: #ffecee;
                padding: 3upx;
                margin-left: 5upx;
				padding: 2upx 6upx;
				color: $uni-color-primary;
            }
        }
    }
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
    .coupon{
        background-color: #fff;
        padding: 0px 15upx 30upx 15upx;
        .ticket{
            padding: 20upx 10upx 20upx 50upx;
            background: rgb(255,67,86);
            border-radius: 10px;
            color: #fff;
            display:flex;
            align-items:baseline;
            font-size: 12px;
            align-items: center;
            text-align: left;
            .ex{
                width: 550upx;
                .text{;
                    height: 48upx;
                    width: 100%;
                    font-size: 28upx;
                    .num{
                        font-size: 42upx;
                    }
                }
                .date{
                    height: 48upx;
                    width: 100%;
                    font-size: 18upx;
                    font-weight: 200;
                    line-height: 20px;
                    color:rgb(255,176,188)
                }
             }
            .button{
                width: 200upx;
				text-align: center;
				font-size: 30upx;
            }
        }
        .description{
            margin: 0px 10upx;
            font-size: 18upx;
            color: rgb(137,137,137);
            line-height: 44upx;
        }
    }
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx 5upx 30upx;
		
		.title{
			font-size: 32upx;
            font-weight: 600;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
            .rewards{
                margin-left: auto;
                background-color: rgb(255,238,231);
                height: 25px;
                line-height: 25px;
                padding: 0px 3px;
                color: rgb(252,28,83);
                font-size: 12px;
            }
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 0upx;
            font-size: 12px;
			color: $font-color-light;
            .num{
                padding-left: 5upx;
                text-decoration: line-through;
            }
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;    
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
            .sales{
                text-align: right;
                .num{
                    font-size: 10px;
                    padding: 0 2px;
                    color: #fa436a;
                }
            }
            
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
                color: red;
			}
			.icon-you{
				margin-left: 10upx;
                color: red;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 0upx;
                
            .name{
                color: #909399;
            }
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;

		padding: 0 30upx;
        padding-bottom: 40upx;
        font-size: 28upx;
		line-height: 44upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 0upx;
		bottom: 0upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750upx;
		height: 100upx;
		background: rgba(255,255,255,.99);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 0upx;
		
		.p-b-btn{
            flex: 2;
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 200upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
            flex: 7;
            margin: 0 10upx;
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
            background-color: rgb(255,238,224);
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 240upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
            .fx{
                color: red;
            }
            .gm{
                margin-right: 0px;
                background-color: red;
                color: #fff;
            }
		}
		.action-btn-group2{
		    flex: 5;
		    margin: 0 10upx;
			display: flex;
			height: 76upx;
			border-radius: 100px;
			align-items: center;
			justify-content: center;
			color: #fff;
			overflow: hidden;
		    background-color: $uni-color-primary;
			position:relative;
		}
	}
        
    .detail-tj{
        margin-top: 20upx;
        .d-header{
            background-color: #fff;
        	display: flex;
        	justify-content: center;
        	align-items: center;
        	height: 80upx;
        	font-size: $font-base + 2upx;
        	color: $font-color-dark;
        	position: relative;
        		
        	text{
        		padding: 0 20upx;
        		background: #fff;
        		position: relative;
        		z-index: 1;
        	}
        	&:after{
        		position: absolute;
        		left: 50%;
        		top: 50%;
        		transform: translateX(-50%);
        		width: 300upx;
        		height: 0;
        		content: '';
        		border-bottom: 1px solid #ccc; 
        	}
        }
    }
	.goods-list{
		display:flex;
		flex-wrap:wrap;
        padding-top: 10upx;
		.text{
            margin: 0 10upx;
        }
		.goods-item{
            background: #fff;
			display:flex;
			flex-direction: column;
			width: 47%;
            margin:0  2% 15upx 2%;
            border-radius:20upx ;
			padding-bottom: 15upx;
			 &:nth-child(2n+1){
				margin-right: 0%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: 26upx;
			color: $font-color-dark;
			line-height: 70upx;
		}
		.price-box{
			display: flex;
			padding-right: 10upx;
			font-size: 24upx;
            line-height: 60upx;
			color: $font-color-light;
            .tex{
                &:before{
                	content: '券后';
                	font-size: 22upx;
                }
                font-size: 20upx;
            }
		}
        .ticket{
            margin-bottom: 10upx;
            font-size: 22upx;
            height: 24upx;
            line-height: 22upx;
            color: #fff;
            display: flex;
            width: max-content;
            border-radius: 2upx;
                
            .tt{
                background-color: rgb(255,105,96);
                
            }
            .icon{
                float: left;
                height: 20upx;
                font-size: 14upx;
                background-color: #fff;
                color: rgb(255,105,96);;
                margin: 2upx 2upx;
                border-radius: 1upx;
                width: 20upx;
                padding: 0 3upx;
            }
            .num{
                line-height: 24upx;
                height: 24upx;
                font-size: 18upx;
                padding: 0upx 2upx;
                border-radius: 1upx;
            }
        }
        .xl-pl{
            font-size: 18upx;
			color: $font-color-light;
        }
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			font-size: 32upx;
			text-align: 600;
            &:before{
				content: '￥';
				font-size: 26upx;
			}
		}
	}
    /* 秒杀专区 */
    .seckill-section{
    	padding: 4upx 30upx 24upx;
    	background: #fff;
        margin-top: 15upx;
    	.s-header{
            font-size: 28upx;
            margin: 15upx 0;
            color: rgb(84,84,84);
        }
        .ticket{
            font-size: 22upx;
            
            height: 29upx;
            line-height: 22upx;
            color: #fff;
            display: flex;
            width: max-content;
                
            .tt{
                background-color: rgb(255,105,96);
                border-radius: 4upx;  
            }
            .icon{
                float: left;
                
                height: 25upx;
				line-height: 25upx;
                font-size: 14upx;
                background-color: #fff;
                color: rgb(255,105,96);;
                margin: 2upx 2upx;
               
                border-radius: 2upx;
                width: 30upx;
                padding: 0 3upx;
            }
            .num{
                line-height: 24upx;
                
                height: 25upx;
				line-height: 25upx;
                font-size: 18upx;
                padding: 0upx 2upx;
                border-radius: 1upx;
				padding: 0 4upx;
            }
        }
    	.floor-list{
    		white-space: nowrap;
    	}
    	.scoll-wrapper{
    		display:flex;
    		align-items: flex-start;
    	}
    	.floor-item{
    		width: 180upx;
    		margin-right: 20upx;
    		font-size: $font-sm+2upx;
    		color: $font-color-dark;
    		line-height: 1.8;
    		image{
    			width: 180upx;
    			height: 180upx;
    			border-radius: 6upx;
    		}
            .quan{
                font-size: 20upx;
                color: rgb(156,156,156);
             }
    		.price{
    			color: $uni-color-primary;
    		}
    	}
    }
    
</style>
