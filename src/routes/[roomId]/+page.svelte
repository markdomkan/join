<script lang="ts">
	import DeviceSelector from '$lib/components/DeviceSelector.svelte';
	import Participants from '$lib/components/Participants.svelte';
	import UserName from '$lib/components/UserName.svelte';
	import UserVideo from '$lib/components/UserVideo.svelte';
	import { errorsStore } from '$lib/store/errors.svelte';
	import { roomStore } from '$lib/store/room.svelte';
	import { userStore } from '$lib/store/user.svelte';
	import { RequestStatus } from '$lib/types';

	$effect(() => {
		if (userStore.nameIsEmpty || roomStore.userIsParticipant) {
			return;
		}
		const participantStatus =
			roomStore.roomOwnerId === userStore.id ? RequestStatus.Accepted : RequestStatus.Waiting;

		try {
			roomStore.addParticipant({
				id: userStore.id,
				name: userStore.name,
				status: participantStatus
			});
		} catch (error) {
			errorsStore.add(error as Error);
		}
	});
</script>

<section class="grid">
	<section class="participants">
		<!-- TODO -->
	</section>
	<section class="user-video">
		<UserVideo />
	</section>
	<section class="controls">
		<UserName />
		<DeviceSelector />
		<Participants />
	</section>
</section>

<style>
	.grid {
		padding: 1rem;
		display: grid;
		flex-grow: 1;
		grid-template-areas:
			'participants participants'
			'user-video controls';
		grid-template-rows: 1fr auto;
		grid-template-columns: auto 1fr;
		.participants {
			grid-area: participants;
			display: flex;
			background-color: red;
			flex-direction: column;
		}

		.user-video {
			aspect-ratio: 16/9;
			grid-area: user-video;
			width: 400px;
			display: flex;
			justify-content: left;
			background-color: blue;
		}

		.controls {
			background-color: blueviolet;
			grid-area: controls;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			align-items: center;
			padding: 1rem;
		}
	}
</style>
