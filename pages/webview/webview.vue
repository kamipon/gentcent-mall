<template>
	<view><web-view :webview-styles="webviewStyles" :src="src"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			webviewStyles: {
				progress: false
				// progress: {
				//     color: '#FF3333'
				// }
			},
			src: this.$store.state.webviewSrc
		};
	},
	onShow(){
		if(this.$store.state.webviewSrc==null||this.$store.state.webviewSrc==""){
			uni.navigateBack()
		}
	},
	onHide(){
		this.$store.state.webviewSrc = null;
	}
};
</script>

<style></style>
