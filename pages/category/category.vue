<template>
	<view class="content">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view @tap="navToSearch()" class="mp-search-box">
			<input class="ser-input" type="text" value="复制标题 搜拼多多优惠券" disabled />
			<image src="../../static/zy-search/search.svg" mode="aspectFit" class="search-icon"></image>
		</view>
		<!-- #endif -->
		<scroll-view scroll-y class="left-aside">
			<view v-for="(item,index) in cats" :key="item.cat_id" class="f-item b-b" :class="{active: index === current}" @click="tabtap(item,index)">
				{{item.cat_name}}
			</view>
		</scroll-view>
		<swiper :current="current" vertical class="right-aside" @change="change">
			<swiper-item v-for="item in cats" :key="item.cat_id" class="s-list">
				<scroll-view scroll-y style="height: 100%;">
					<view >
						<text class="s-item">{{item.cat_name}}</text>
						<view class="t-list">
							<view v-for="t in item.slist" :key="t.cat_id" @click="navToList(t.cat_id)" class="t-item">
								<text>{{t.cat_name}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				currentId: 1,
				flist: [],
                cats :[],
			}
		},
		onLoad(){
			this.loadData();
            this.$_get("app_goods/cats",{},{loading:false}).then(res => {//获取一级目录
                let list = res.goods_cats_get_response.goods_cats_list;
                list.forEach(item=>{
                    item.slist = [];
                    this.cats.push(item);
                    
                })
                this.$_get("app_goods/cats",{id:this.cats[0].cat_id},{loading:false}).then(res => {//获取二级目录\
                    let slist = res.goods_cats_get_response.goods_cats_list;
                    this.cats[0].slist = slist;
                });
            });
		},
		methods: {
			async loadData(){
				let list = await this.$api.json('cateList');
				list.forEach(item=>{
					if(!item.pid){
						let slist = [];
						for (var i = 0; i < list.length; i++) {
							if(list[i].pid === item.id){
								let tlist = [];
								for (var j = 0; j < list.length; j++) {
									if(list[j].pid === list[i].id){
										tlist.push(list[j]);
									}
								}
								list[i].tlist = tlist;
								slist.push(list[i]);
							}
						}
						item.slist = slist;
						this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
					}
				}) 
                    console.log(this.flist)
			},
			//一级分类点击
			tabtap(item,index){
				this.currentId = item.id;
                console.log("+++++++++++++")
				this.current = index;
			},
			change(e){
                this.$_get("app_goods/cats",{id:this.cats[e.detail.current].cat_id},{loading:false}).then(res => {//获取二级目录
                    console.log(res.goods_cats_get_response.goods_cats_list)
                    let slist = res.goods_cats_get_response.goods_cats_list;
                    this.cats[e.detail.current].slist = slist;
                    //获取三级目录
                });
				this.current = e.detail.current;
			},
			navToList(e){
				uni.navigateTo({
                	url: `/pages/product/searchList?catId=${e}`
				})
			},
			navToSearch(){
				uni.navigateTo({
					url: `/pages/search/search`
				});
			}
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: `/pages/search/search`
			});
		}
		// #endif
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #fff;
	}
	/* #ifdef MP */
	.mp-search-box {
		position: fixed;
		left: 0;
		top: 0;
		background-color: #FFF;
		z-index: 9999;
		width: 100%;
		padding: 0 20upx 15upx 20upx;
		color: rgb(0, 0, 0);
		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: rgb(96, 98, 102);
			background-color: #FFF;
			border-radius: 20px;
			background-color: rgba(231, 231, 231, 0.7);
		}
		.search-icon{
			width: 40upx;
			height: 40upx;
			padding: 2upx 2upx 2upx 0;
			position: absolute;
			left: 50upx;
			top: 7upx;
			z-index: 10;
		}
	}
	/* #endif */

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 250upx;
		height: 100%;
		background-color: #f8f8f8;
		/* #ifdef MP */
		padding-top: 70upx;
		/* #endif */
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		line-height: 50upx;
		padding: 0 20upx;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		&.active{
			color: $base-color;
			background: #fff;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 100upx;
				width: 6upx;
				background-color: $base-color;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
		min-height: 100%;
		/* #ifdef MP */
		padding-top: 70upx;
		/* #endif */
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 18upx;
		font-size: 28upx;
		color: $font-color-dark;
	} 
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 24upx;
		color: #666;
		background-color: $backg-color-grey;
		margin: 10upx 20upx;
		height: 70upx;
		
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		line-height: 35upx;
		padding: 0 20upx;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		
		image{
			width: 120upx;
			height: 120upx;
		}
	}
</style>
