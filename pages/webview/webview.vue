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
	}
};
</script>

<style></style>
