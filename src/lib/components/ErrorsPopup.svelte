<script lang="ts">
	import { errorsStore } from '$lib/store/errors.svelte';
</script>

{#each errorsStore.errors as error, index}
	<section class="backdrop">
		<dialog class="card" open>
			<header class="card-header">
				<h2>Error</h2>
			</header>
			<section class="card-body">
				<p>{error.message}</p>
			</section>
			<footer class="card-footer">
				<button
					on:click={async () => {
						await error.action?.();
						errorsStore.remove(index);
					}}
				>
					Ok
				</button>
			</footer>
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
