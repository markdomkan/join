<script lang="ts">
	import type { Snippet } from 'svelte';
	import ErrorsPopup from '$lib/components/ErrorsPopup.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1a1a" />
</svelte:head>

<main>
	{@render children()}

	<ErrorsPopup />
</main>

<style>
	main {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
