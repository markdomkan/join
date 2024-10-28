<script lang="ts">
	import { roomStore } from '$lib/store/room.svelte';
	import { userStore } from '$lib/store/user.svelte';
	import { RequestStatus } from '$lib/types';

	const userIsOwner = $derived(roomStore.roomOwnerId === userStore.id);
</script>

<section>
	<h2>Participants</h2>
	<ul class="participants-list">
		{#each roomStore.participants as participant}
			<li>
				{#if userIsOwner}
					<label class="participant">
						<span>
							{participant.name}
							{#if participant.id === userStore.id}
								<span class="participant-you">(you)</span>
							{/if}
						</span>
						<select
							disabled={participant.id === userStore.id}
							bind:value={participant.status}
							onchange={() => roomStore.updateParticipantStatus(participant.id, participant.status)}
						>
							<option value={RequestStatus.Accepted}>Accepted</option>
							<option value={RequestStatus.Rejected}>Rejected</option>
							<option value={RequestStatus.Waiting}>Waiting</option>
						</select>
					</label>
				{:else}
					<div class="participant">
						<span>
							{participant.name}
							{#if participant.id === userStore.id}
								<span class="participant-you">(you)</span>
							{/if}
						</span>
						{participant.status}
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.participants-list {
		list-style-type: none;
		padding: 0;
	}
	.participant {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	.participant-you {
		font-style: italic;
	}
</style>
