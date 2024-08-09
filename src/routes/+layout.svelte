<script lang="ts">
	import ErrorsPopup from '$lib/components/ErrorsPopup.svelte';
	import initializeProviders from '$lib/providers';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let ready = $state(false);

	onMount(async () => {
		await initializeProviders();
		ready = true;
	});
</script>

<svelte:head>
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1a1a" />
</svelte:head>

<main>
	{#if ready}
		{@render children()}
	{:else}
		<p>Loading...</p>
	{/if}
	<ErrorsPopup />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}
</style>
