<script lang="ts">
	import { getUserName, saveUserName, clearUserName } from '$lib/repositories/userRepository';
	import { user } from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';

	onMount(async () => (user.name = await getUserName()));

	$effect(updateName);

	function updateName() {
		if (!user.name) {
			clearUserName();
			return;
		}
		saveUserName(user.name);
	}
</script>

<section>
	<div>
		<label>
			<p>Your name:</p>
			<input type="text" bind:value={user.name} />
		</label>
	</div>
</section>
