<script lang="ts">
	import { debounce } from '$lib/helper/debounce';
	import { bus } from '$lib/providers/bus';
	import { userRepository } from '$lib/providers/repositories/userRepository';
	import { store } from '$lib/providers/store.svelte';

	const updateUserName = debounce(() => {
		bus.emit('UserNameChange', store.user.name);
		userRepository.saveUserName(store.user.name);
	});
</script>

<section class:full={!store.user.name}>
	<div class="container">
		<label>
			Your name:
			<input type="text" onkeydown={updateUserName} bind:value={store.user.name} />
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
