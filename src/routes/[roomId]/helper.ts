import { goto } from '$app/navigation';
import { authProvider } from '$lib/providers/auth';
import { roomRepository } from '$lib/providers/repositories/roomRepository';
import { userRepository } from '$lib/providers/repositories/userRepository';
import { errorsStore } from '$lib/store/errors.svelte';
import { roomStore } from '$lib/store/room.svelte';
import { userEventBus, userStore } from '$lib/store/user.svelte';

export async function getUserInfo() {
	try {
		userStore.setId(authProvider.getUserId());
		userStore.setName(userRepository.getUserName());
	} catch {
		errorsStore.add({
			message: 'An error occurred while trying to get the user information',
			action: () => goto('/')
		});
	}
}

export async function getRoomInfo(roomId: string) {
	try {
		const roomInfo = await roomRepository.getRoomInfo(roomId);
		roomStore.setRoomId(roomId);
		roomStore.setRoomOwnerId(roomInfo.ownerId);
	} catch (error) {
		const errors: Record<string, string> = {
			[roomRepository.codeErrors.RoomNotFoundError]:
				'The room does not exist. Please check the room ID or create a new room',
			default: 'An error occurred while trying to create the request'
		};
		errorsStore.add({
			message: errors[(error as Error).message] || `${errors.default}: ${(error as Error).message}`,
			action: () => goto('/')
		});
	}
}

export function subscribeToParticipantsChanges(roomId: string): () => void {
	return roomRepository.subscribeToParticipantsChanges(roomId, (participants) =>
		roomStore.setAllParticipants(participants)
	);
}

export async function tryToConnect() {
	if (roomStore.participants.some((participant) => participant.id === userStore.id)) {
		return;
	}
	if (userStore.name === undefined || userStore.name.trim() === '') {
		userEventBus.once('name-updated', tryToConnect);
		return;
	}
	await createEnterRequest();
}

export async function createEnterRequest() {
	try {
		await roomRepository.setNewRequestToRoom(roomStore.roomId, {
			id: userStore.id,
			name: userStore.name
		});
	} catch {
		errorsStore.add({
			message: 'An error occurred while trying to enter the room',
			action: () => goto('/')
		});
	}
}
