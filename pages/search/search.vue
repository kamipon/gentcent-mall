<template>
	<view>
		<zy-search 
        :is-focus="isFocus" 
        :theme="themeClass" 
        :keyword = "keyword"
        :show-want="true" 
        :speechEngine="speechEngine"
		:hot-list="hotList" 
        @getSearchText="getSearchText"
        ></zy-search>
	</view>
</template>

<script>
	import zySearch from '@/components/zy-search/zy-search.vue'
	export default {
		components: {
			zySearch
		},
		data() {
			return {
				themeClass: 'block',
				speechEngine: 'baidu', //语音识别引擎
				hotList: ['红酒','口罩','方便面','华为']	,//初始化推荐列表
                keyword : "",
                isFocus :false,
			}
		},
        onLoad(options){
        	this.keyword = options.keyword;
            if(this.keyword){
                this.isFocus=true;
            }
        },
		methods: {
			getSearchText(e) {
				uni.redirectTo({
					url: `/pages/product/searchList?keyword=${e}`
				})
			}
		},
	}
</script>

<style>
</style>
