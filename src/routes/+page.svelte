<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUserId } from '$lib/providers/firebase/auth';
	import { createRoomIdentifier } from '$lib/providers/identifier';
	import { publishNewRoom } from '$lib/repositories/roomRepository';

	let newRoomId = '';

	async function createRoom() {
		const roomId = createRoomIdentifier();
		await publishNewRoom(roomId, getUserId());
		goto(`/${roomId}`);
	}
</script>

<section>
	<div>
		<p>Click the button to create a new room.</p>
		<button onclick={createRoom}>Create New Room</button>
	</div>
	<div>
		<p>Or enter a room ID:</p>
		<input type="text" bind:value={newRoomId} />
		<button onclick={() => goto(`/${newRoomId}`)}> Enter to room </button>
	</div>
</section>
