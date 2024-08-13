<script lang="ts">
	import { store } from '$lib/providers/store.svelte';

	let video: HTMLVideoElement;

	$effect(() => void setMediaStreamToLocalVideo());
	async function setMediaStreamToLocalVideo() {
		if (!store.user.mediaStream) {
			return;
		}
		video.srcObject = store.user.mediaStream;
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
		border-radius: 6px;
	}
</style>
