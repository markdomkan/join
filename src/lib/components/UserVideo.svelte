<script lang="ts">
	import { mediaStreams } from '$lib/stores/mediaStreams.svelte';

	let video: HTMLVideoElement;

	$effect(() => void setMediaStreamToLocalVideo());
	async function setMediaStreamToLocalVideo() {
		if (!mediaStreams.user) {
			return;
		}
		video.srcObject = mediaStreams.user;
		console.log('Playing video');
		await video.play();
		console.log('Video played');
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
		position: absolute;
		width: 30%;
		bottom: 30px;
		left: 30px;
		resize: horizontal;
		overflow: hidden;
		border-radius: 6px;
	}
</style>
