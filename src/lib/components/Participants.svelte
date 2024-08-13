<script lang="ts">
	import { store } from '$lib/providers/store.svelte';
	import { RequestStatus } from '../../types';

	const participants = $derived(store.room.participants.entries());
</script>

<section>
	<h2>Participants</h2>
	<ul>
		{#each participants as [_, participant]}
			<li>
				<label>
					{participant.name}
					<select
						bind:value={participant.status}
						on:change={() => {
							//
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
