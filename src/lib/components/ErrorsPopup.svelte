<script lang="ts">
	import { errors } from '$lib/stores/errors.svelte';
</script>

{#each errors as error, index}
	<section class="backdrop">
		<dialog class="card" open>
			<header class="card-header">
				<h2>Error</h2>
				<button on:click={() => errors.splice(index, 1)}>Close</button>
			</header>
			<section class="card-body">
				<p>{error.message}</p>
			</section>
		</dialog>
	</section>
{/each}

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
