<script lang="ts">
	import {
		changeRequestStatus,
		getParticipants,
		onParticipantsRequests
	} from '$lib/repositories/roomRepository';
	import { room } from '$lib/stores/room.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { RequestStatus, type Participant } from '../../types';

	let onParticipantsRequestsUnsubscribe: () => void = () => {};

	onMount(init);

	onDestroy(onParticipantsRequestsUnsubscribe);

	async function init() {
		room.participants = await getParticipants(room.id);
		onParticipantsRequestsUnsubscribe = onParticipantsRequests(
			room.id,
			(participants: Participant[]) => (room.participants = participants)
		);
	}
</script>

<section>
	<h2>Participants</h2>
	<ul>
		{#each room.participants as participant}
			<li>
				<label>
					{participant.name}
					<select
						bind:value={participant.status}
						on:change={() => {
							changeRequestStatus(room.id, participant.id, participant.status);
						}}
					>
						<option value={RequestStatus.Accepted}>Accepted</option>
						<option value={RequestStatus.Rejected}>Rejected</option>
						<option value={RequestStatus.Waiting}>Waiting</option>
					</select>
				</label>
			</li>
		{/each}
	</ul>
</section>
