import { RequestStatus, type Participant, type Room } from '$lib/types';
import { get, getDatabase, onDisconnect, onValue, ref, set, update } from 'firebase/database';

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

function subscribeToParticipantsChanges(
	roomId: string,
	callback: (participants: Participant[]) => void
): () => void {
	const roomRef = ref(getDatabase(), `${roomId}/participants`);
	return onValue(roomRef, (snapshot) => {
		const val: Record<string, Participant> = snapshot.val();
		const res = val ? Object.entries(val).map(([id, participant]) => ({ ...participant, id })) : [];
		callback(res);
	});
}

async function addNewRequestToRoom(roomId: string, participant: Participant): Promise<void> {
	const db = getDatabase();
	const participantRef = ref(db, `${roomId}/participants/${participant.id}`);
	onDisconnect(participantRef).remove();
	await set(participantRef, participant);
}

async function addMediaStreamToUser(roomId: string, userId: string, mediaStream: MediaStream) {
	const db = getDatabase();
	const participantRef = ref(db, `${roomId}/participants/${userId}`);
	await update(participantRef, {
		mediaStream
	});
}

async function updateParticipantStatus(
	roomId: string,
	participantId: string,
	status: RequestStatus
) {
	await update(ref(getDatabase(), `${roomId}/participants/${participantId}`), {
		status
	});
}

async function updateParticipantName(roomId: string, participantId: string, name: string) {
	await update(ref(getDatabase(), `${roomId}/participants/${participantId}`), {
		name
	});
}

export const roomRepository = {
	getRoomInfo,
	CodeErrors,
	publishNewRoomId,
	subscribeToParticipantsChanges,
	addNewRequestToRoom,
	updateParticipantStatus,
	addMediaStreamToUser,
	updateParticipantName
};
