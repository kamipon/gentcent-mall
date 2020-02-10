<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="(item,index) in flist" :key="item.id" class="f-item b-b" :class="{active: index === current}" @click="tabtap(item,index)">
				{{item.name}}
			</view>
		</scroll-view>
		<swiper :current="current" vertical class="right-aside" @change="change">
			<swiper-item v-for="item in flist" :key="item.id" class="s-list">
				<scroll-view scroll-y style="height: 100%;">
				<view v-for="s in item.slist" :key="s.id">
					<text class="s-item">{{s.name}}</text>
					<view class="t-list">
						<view v-for="t in s.tlist" :key="t.id" @click="navToList(s.id, t.id)" class="t-item">
							<image :src="t.picture"></image>
							<text>{{t.name}}</text>
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
				flist: []
			}
		},
		onLoad(){
			this.loadData();
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
			},
			//一级分类点击
			tabtap(item,index){
				this.currentId = item.id;
				this.current = index;
			},
			change(e){
				this.current = e.detail.current;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #fff;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #f8f8f8;
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
		padding-bottom: 20upx;
		
		image{
			width: 120upx;
			height: 120upx;
		}
	}
</style>
