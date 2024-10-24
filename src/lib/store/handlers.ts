import { roomRepository } from '$lib/providers/repositories/roomRepository';
import { userRepository } from '$lib/providers/repositories/userRepository';
import { roomEventBus, roomStore } from './room.svelte';
import { userEventBus } from './user.svelte';

export function subscribeHandlersToStoreEvents(): () => void {
	userEventBus.on('name-updated', async (name) => userRepository.saveUserName(name));
	userEventBus.on('name-updated', async () => {
		//TODO: update the participant name in the room
	});
	userEventBus.on('media-stream-updated', async () => {
		//TODO: update the participant media stream in the room
	});
	// ROOM
	roomEventBus.on('participant-status-updated', async (participant) =>
		roomRepository.updateParticipantStatus(roomStore.roomId, participant.id, participant.status)
	);

	return () => {
		userEventBus.offAll('name-updated');
		userEventBus.offAll('media-stream-updated');
	};
}
