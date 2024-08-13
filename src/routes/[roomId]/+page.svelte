<script lang="ts">
	import { goto } from '$app/navigation';
	import DeviceSelector from '$lib/components/DeviceSelector.svelte';
	import Participants from '$lib/components/Participants.svelte';
	import UserName from '$lib/components/UserName.svelte';
	import UserVideo from '$lib/components/UserVideo.svelte';
	import { authProvider } from '$lib/providers/auth';
	import { roomRepository } from '$lib/providers/repositories/roomRepository';
	import { userRepository } from '$lib/providers/repositories/userRepository';
	import { store, storeHelpers } from '$lib/providers/store.svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };

	async function init() {
		await getUserInfo();
		await getRoomInfo();
	}

	async function getUserInfo() {
		try {
			store.user = {
				id: authProvider.getUserId(),
				name: userRepository.getUserName()
			};
		} catch (error) {
			store.errors.push({
				message: 'An error occurred while trying to get the user information',
				action: () => goto('/')
			});
		}
	}

	async function getRoomInfo() {
		try {
			store.room = storeHelpers.parseRoom(await roomRepository.getRoomInfo(data.roomId));
		} catch (error) {
			const errors: Record<string, string> = {
				[roomRepository.codeErrors.RoomNotFoundError]:
					'The room does not exist. Please check the room ID or create a new room',
				default: 'An error occurred while trying to create the request'
			};
			store.errors.push({
				message:
					errors[(error as Error).message] || `${errors.default}: ${(error as Error).message}`,
				action: () => goto('/')
			});
		}
	}
</script>

{#await init()}
	Loading...
{:then}
	<section class="grid">
		<section class="participants"></section>
		<section class="user-video">
			<UserVideo />
		</section>
		<section class="controls">
			<UserName />
			<DeviceSelector />
			<Participants />
		</section>
	</section>
{/await}

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
