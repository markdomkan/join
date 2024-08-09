import { get, getDatabase, onDisconnect, onValue, ref, set } from 'firebase/database';

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
	return Object.values(participants);
}

export function onRequests(
	roomId: string,
	callback: (participant: Participant[]) => void
): () => void {
	const db = getDatabase();
	const roomRef = ref(db, `${roomId}/requests`);

	return onValue(roomRef, (snapshot) => callback(parseParticipantObj(snapshot.val())));
}

export async function changeRequestStatus(
	roomId: string,
	participantId: string,
	requestStatus: Participant['status']
): Promise<void> {
	const db = getDatabase();
	await set(ref(db, `${roomId}/requests/${participantId}`), requestStatus);
}

export async function createNewRequest(
	roomId: string,
	userId: string,
	name: string,
	status: Participant['status']
) {
	const db = getDatabase();

	const requestRef = ref(db, `${roomId}/requests/${userId}`);
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
