import { authProvider } from '$lib/providers/auth';
import { roomRepository } from '$lib/providers/repositories/roomRepository';
import { roomStore } from '$lib/store/room.svelte';
import { userStore } from '$lib/store/user.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const roomOwnerId = await roomRepository.getRoomOwnerId(params.roomId);
	const userId = authProvider.getUserId();
	roomStore.init(params.roomId, roomOwnerId);
	userStore.setId(userId);
};
