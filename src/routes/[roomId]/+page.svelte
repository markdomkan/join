<script lang="ts">
	import DeviceSelector from '$lib/components/DeviceSelector.svelte';
	import UserVideo from '$lib/components/UserVideo.svelte';
	import { createNewRequest, getRoomOwnerId } from '$lib/repositories/roomRepository';
	import { addError } from '$lib/stores/errors.svelte';
	import { room } from '$lib/stores/room.svelte';

	import { user } from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	import UserName from '../../lib/components/UserName.svelte';
	import type { PageData } from './$types';
	import Participants from '$lib/components/Participants.svelte';

	let { data } = $props() as { data: PageData };

	onMount(getRoomInfo);

	$effect(() => void ifValidCreateRequest());

	async function getRoomInfo() {
		room.id = data.roomId;
		room.ownerId = await getRoomOwnerId(room.id);
	}

	async function ifValidCreateRequest() {
		if (!user.userIsValid()) {
			return;
		}
		try {
			await createNewRequest(room.id, user.uid!, user.name!);
		} catch (error) {
			const errors: Record<string, string> = {
				RoomNotFoundError: 'The room does not exist. Please check the room ID or create a new room',
				default: 'An error occurred while trying to create the request'
			};
			addError(
				errors[(error as Error).message] || `${errors.default}: ${(error as Error).message}`
			);
		}
	}
</script>

<UserVideo />
<DeviceSelector />
<UserName />
<Participants />
