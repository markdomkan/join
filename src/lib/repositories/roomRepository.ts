import { get, getDatabase, onDisconnect, onValue, ref, set } from 'firebase/database';
import { RequestStatus, type Participant } from '../../types';

export async function publishNewRoom(id: string, ownerId: string): Promise<void> {
	const db = getDatabase();

	await set(ref(db, id), {
		ownerId
	});
}

function parseParticipantObj(participants: Record<string, Participant>): Participant[] {
	if (!participants) {
		return [];
	}
	return Object.entries(participants).map(([id, participant]) => ({
		...participant,
		id
	}));
}

export async function getParticipants(roomId: string): Promise<Participant[]> {
	const db = getDatabase();
	const roomRef = ref(db, `${roomId}/participants`);
	const snapshot = await get(roomRef);
	return parseParticipantObj(snapshot.val());
}

export function onParticipantsRequests(
	roomId: string,
	callback: (participant: Participant[]) => void
): () => void {
	const db = getDatabase();
	const roomRef = ref(db, `${roomId}/participants`);
	return onValue(roomRef, (snapshot) => callback(parseParticipantObj(snapshot.val())));
}

export async function changeRequestStatus(
	roomId: string,
	participantId: string,
	requestStatus: RequestStatus
): Promise<void> {
	const db = getDatabase();
	await set(ref(db, `${roomId}/participants/${participantId}/status`), requestStatus);
}

export async function createNewRequest(roomId: string, userId: string, name: string) {
	const db = getDatabase();
	if (!(await checkIfRoomExists(roomId))) {
		throw new Error('RoomNotFoundError');
	}
	const ownerId = await getRoomOwnerId(roomId);
	const status: RequestStatus = ownerId === userId ? RequestStatus.Accepted : RequestStatus.Waiting;
	const requestRef = ref(db, `${roomId}/participants/${userId}`);
	await set(requestRef, {
		name,
		status
	});
	onDisconnect(requestRef).remove();
}

export async function getRoomOwnerId(roomId: string): Promise<string> {
	const db = getDatabase();
	const roomRef = ref(db, roomId);
	const snapshot = await get(roomRef);
	return snapshot.val().ownerId;
}

async function checkIfRoomExists(roomId: string): Promise<boolean> {
	const db = getDatabase();
	const roomRef = ref(db, roomId);
	const snapshot = await get(roomRef);
	return snapshot.exists();
}
