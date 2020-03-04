<template>
	<view class="container">
		<!-- 分类推荐楼层 -->
		<view class="hot-floor">
			<view class="floor-img-box" @click="navChannellList(1)">
				<image class="floor-img" :src="titlePic" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 今日推荐 -->
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
			<view style="text-align: center;width: 100%;"><uni-load-more :status="more"></uni-load-more></view>
			<view @click="scrollToTop()" :class="{ 'bgt-top-button-show': showScrollToTopBtn }" class="bgt-go-top"><text>顶部</text></view>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { mapState, mapActions } from 'vuex';
export default {
	components: { uniLoadMore },
	data() {
		return {
			goodsList: [],
			pageIndex: 1,
			more: 'loading',
			showScrollToTopBtn: false,
			channelType: null,
			titlePic: "//pinduoduoimg.yangkeduo.com/jinbao/today_burst_banner.png"
		};
	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	filters: {
		toFiexd(num, pre = 2) {
			return parseFloat(num).toFixed(pre);
		}
	},
	onPageScroll({ scrollTop }) {
		if (scrollTop >= 1200) {
			this.showScrollToTopBtn = true;
		} else {
			this.showScrollToTopBtn = false;
		}
	},
	onLoad({ channelType }) {
		let channelTitle = "";
		if (channelType) {
			this.channelType = channelType;
			console.log(channelType);
			if(channelType == 0){
				channelTitle = "限时特惠";
				this.titlePic = "//pinduoduoimg.yangkeduo.com/jinbao/one_nine_banner.png";
			}else if(channelType == 1){
				channelTitle = "今日爆款推荐";
				this.titlePic = "//pinduoduoimg.yangkeduo.com/jinbao/today_burst_banner.png";
			}else if(channelType == 2){
				channelTitle = "品牌清仓";
				this.titlePic = "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2656106131,1339985382&fm=26&gp=0.jpg";
			}
		}
		uni.setNavigationBarTitle({
			title: channelTitle
		});
		this.loadData();
	},
	onReachBottom() {
		this.more = 'loading';
		this.loadData();
	},
	methods: {
		loadData() {
			let pageSize = 40;
			this.$_get('app_goods/goods/channel', { pageIndex: this.pageIndex, pageSize: pageSize, channelType: this.channelType }, { loading: false }).then(res => {
				this.pageIndex++;
				if (Math.round(res.data.total / pageSize) <= this.pageIndex) {
					this.more = 'noMore';
				} else {
					this.more = 'more';
				}
				this.goodsList = this.goodsList.concat(res.data.list);
			});
		},
		//详情页
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			let id = item.goodsId;
			uni.navigateTo({
				url: `/pages/product/product?id=${id}`
			});
		},
		scrollToTop() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		}
	}
};
</script>

<style lang="scss">
/* #ifdef MP */
.mp-search-box {
	position: fixed;
	left: 0;
	top: 0;
	background-color: #fff;
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
		background-color: #fff;
		border-radius: 20px;
		background-color: rgba(231, 231, 231, 0.7);
	}
	.search-icon {
		width: 40upx;
		height: 40upx;
		padding: 2upx 2upx 2upx 0;
		position: absolute;
		left: 50upx;
		top: 7upx;
		z-index: 10;
	}
}
page {
	.cate-section {
		position: relative;
		z-index: 5;
		border-radius: 16upx 16upx 0 0;
		margin-top: -20upx;
	}
	.carousel-section {
		padding: 0;
		.titleNview-placing {
			padding-top: 0;
			height: 0;
		}
		.carousel {
			.carousel-item {
				padding: 0;
			}
		}
		.swiper-dots {
			left: 45upx;
			bottom: 40upx;
		}
	}
}
/* #endif */

page {
	background: #f5f5f5;
}
.m-t {
	margin-top: 16upx;
}
/* 头部 轮播图 */
.carousel-section {
	position: relative;
	padding-top: 10px;

	.titleNview-placing {
		height: var(--status-bar-height);
		padding-top: 44px;
		box-sizing: content-box;
	}

	.titleNview-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 426upx;
		transition: 0.4s;
	}
}
.carousel {
	width: 100%;
	height: 350upx;

	.carousel-item {
		width: 100%;
		height: 100%;
		padding: 0 28upx;
		overflow: hidden;
	}

	image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}
}
.swiper-dots {
	display: flex;
	position: absolute;
	left: 60upx;
	bottom: 15upx;
	width: 72upx;
	height: 36upx;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
	background-size: 100% 100%;

	.num {
		width: 36upx;
		height: 36upx;
		border-radius: 50px;
		font-size: 24upx;
		color: #fff;
		text-align: center;
		line-height: 36upx;
	}

	.sign {
		position: absolute;
		top: 0;
		left: 50%;
		line-height: 36upx;
		font-size: 12upx;
		color: #fff;
		transform: translateX(-50%);
	}
}
/* 分类 */
.cate-section {
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	padding: 20upx 22upx;
	background: #fff;
	position: relative;
	.cate-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
	}
	image {
		width: 88upx;
		height: 88upx;
		margin-bottom: 14upx;
	}
}
.ad-1 {
	width: 100%;
	height: 312upx;
	background: #fff;
	margin-top: -50upx;
	image {
		width: 100%;
		height: 100%;
	}
}

.f-header {
	display: flex;
	align-items: center;
	height: 120upx;
	padding: 6upx 30upx 8upx;
	background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
	box-shadow: 2upx -2upx 10upx rgba(113, 101, 104, 0.07);
	image {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		margin-right: 20upx;
	}
	.block {
		height: 44upx;
		width: 8upx;
		background-color: rgb(247, 167, 0);
		margin-right: 10upx;
	}
	.more-text {
		font-size: 26upx;
		color: $font-color-light;
	}
	.tit-box {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.tit {
		font-size: $font-lg + 4upx;
		color: rgb(247, 167, 0);
		line-height: 1.3;
	}
	.tit2 {
		margin-left: 10upx;
		font-size: $font-sm;
		color: $font-color-light;
	}
	.icon-you {
		font-size: $font-lg + 2upx;
		color: $font-color-light;
	}
}
/* 分类推荐楼层 */
.hot-floor {
	width: 100%;
	overflow: hidden;
	margin-bottom: 20upx;
	.floor-img-box {
		width: 100%;
		height: 320upx;
		position: relative;
	}
	.floor-img {
		width: 100%;
		height: 100%;
	}
	.floor-list {
		white-space: nowrap;
		padding: 20upx 10upx;
		border-radius: 6upx;
		margin-top: -80upx;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
		background: rgba(245, 245, 245, 0.8);
		position: relative;
		z-index: 1;
	}
	.scoll-wrapper {
		display: flex;
		align-items: flex-start;
	}
	.floor-item {
		width: 240upx;
		margin-right: 20upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		line-height: 1.8;
		image {
			width: 240upx;
			height: 240upx;
			border-radius: 6upx;
		}
		.price {
			color: $uni-color-primary;
		}
		.discount-price {
			font-size: 24upx;
			color: $font-color-grey;
			line-height: 1;
			margin-left: 10upx;
			font-weight: 400;
			width: 100%;
			text-decoration: line-through;
		}
	}
	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-shrink: 0;
		width: 240upx;
		height: 240upx;
		border-radius: 6upx;
		background: #fff;
		font-size: $font-base;
		color: $font-color-light;
		text:first-child {
			margin-bottom: 4upx;
		}
	}
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
.bgt-go-top {
	display: block;
	width: 84upx;
	height: 84upx;
	position: fixed;
	right: 16upx;
	bottom: 128upx;
	z-index: 999;
	background-image: url(data:image/png;base64,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);
	background-size: contain;
	opacity: 0;
	-webkit-transition: bottom 0.8s ease, opacity 0.6s ease;
	text {
		position: absolute;
		bottom: 14upx;
		width: 100%;
		display: block;
		height: 24upx;
		line-height: 24upx;
		text-align: center;
		font-size: 24upx;
		color: #333;
	}
}
.bgt-top-button-show {
	bottom: 128upx;
	opacity: 1;
}
</style>
