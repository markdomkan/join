import { get, getDatabase, onDisconnect, onValue, ref, set, update } from 'firebase/database';
import { RequestStatus, type Participant, type Room } from '$lib/types';

type User = {
	id: string;
	name: string;
};

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

async function setNewRequestToRoom(roomId: string, user: User): Promise<void> {
	const db = getDatabase();
	const roomSnapshot = await get(ref(db, roomId));
	const roomOwnerId = roomSnapshot.val().ownerId;
	const status: RequestStatus =
		roomOwnerId === user.id ? RequestStatus.Accepted : RequestStatus.Waiting;
	const participantRef = ref(db, `${roomId}/participants/${user.id}`);
	onDisconnect(participantRef).remove();
	await set(participantRef, {
		id: user.id,
		name: user.name,
		status
	});
}

async function updateParticipantStatus(
	roomId: string,
	participantId: string,
	status: RequestStatus
) {
  console.log(roomId, participantId, status);
	await update(ref(getDatabase(), `${roomId}/participants/${participantId}`), {
		status
	});
}

export const roomRepository = {
	getRoomInfo,
	codeErrors: CodeErrors,
	publishNewRoomId,
	subscribeToParticipantsChanges,
	setNewRequestToRoom,
	updateParticipantStatus
};
