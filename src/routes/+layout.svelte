
<svelte:head>
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1a1a" />
</svelte:head>

<main>

	
	<slot />
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
