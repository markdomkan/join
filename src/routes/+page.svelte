<script lang="ts">
	import { goto } from '$app/navigation';
	import { authProvider } from '$lib/providers/auth';
	import { idProvider } from '$lib/providers/identifier';
	import { roomRepository } from '$lib/providers/repositories/roomRepository';

	let newRoomId = $state('');
	let loading = $state(false);

	async function createRoom() {
		loading = true;
		const roomId = idProvider.create();
		const ownerId = authProvider.getUserId();
		await roomRepository.publishNewRoomId(roomId, ownerId);
		await goto(`/${roomId}`);
	}
</script>

<section>
	<div>
		<p>Click the button to create a new room.</p>
		<button disabled={loading} onclick={createRoom}> Create new room </button>
	</div>
	<div>
		<p>Or enter a room ID:</p>
		<input type="text" bind:value={newRoomId} />
		<button
			disabled={loading}
			onclick={() => {
				loading = true;
				goto(`/${newRoomId}`);
			}}
		>
			Enter to room
		</button>
	</div>
</section>
