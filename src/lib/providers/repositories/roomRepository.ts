import { getDatabase, ref, set, get } from 'firebase/database';
import type { Room } from '../../types';

const CodeErrors = {
	RoomNotFoundError: 'RoomNotFoundError'
};

async function publishNewRoomId(id: string, ownerId: string): Promise<void> {
	await set(ref(getDatabase(), id), {
		ownerId
	});
}

async function getRoomInfo(roomId: string): Promise<Room> {
	const snapshot = await get(ref(getDatabase(), roomId));
	if (!snapshot.exists()) {
		throw new Error(CodeErrors.RoomNotFoundError);
	}
	return { id: roomId, ...snapshot.val() };
}

export const roomRepository = {
	getRoomInfo,
	codeErrors: CodeErrors,
	publishNewRoomId
};
