<script lang="ts">
	import { debounce } from '$lib/helper/debounce';
	import { userStore } from '$lib/store/user.svelte';

	let userName = $state(userStore.name);

	const updateUserName = debounce(() => {
		userStore.setName(userName || '');
	});
</script>

<section class:full={!userStore.name}>
	<h2>User name</h2>
	<div class="container">
		<label>
			Your name:
			<input type="text" onkeydown={updateUserName} bind:value={userName} />
		</label>
	</div>
</section>

<style>
	.full {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);

		.container {
			padding: 2rem;
			border-radius: 0.5rem;
			background-color: var(--background-alt);
		}
	}
</style>
