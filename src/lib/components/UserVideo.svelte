<script lang="ts">
	import { userStore } from '$lib/store/user.svelte';

	let video: HTMLVideoElement;

	$effect(() => void setMediaStreamToLocalVideo());
	async function setMediaStreamToLocalVideo() {
		if (!userStore.mediaStream) {
			return;
		}
		video.srcObject = userStore.mediaStream;
		await video.play();
	}
</script>

<section>
	<div class="video-container">
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<video bind:this={video} muted />
	</div>
</section>

<style>
	.video-container {
		aspect-ratio: 16/9;
		overflow: hidden;
	}
</style>
