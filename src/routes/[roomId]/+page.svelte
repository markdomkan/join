<script lang="ts">
	import DeviceSelector from '$lib/components/DeviceSelector.svelte';
	import UserVideo from '$lib/components/UserVideo.svelte';
	import UserName from '../../lib/components/UserName.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<UserVideo />
<DeviceSelector />
<UserName />
