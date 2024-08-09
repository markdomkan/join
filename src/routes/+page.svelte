<script lang="ts">
	import { goto } from '$app/navigation';
	import { createNewRoom } from '$lib/application/createNewRoom';

	let newRoomId = '';

	async function createRoom() {
		const roomId = await createNewRoom();
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
