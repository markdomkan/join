import { RequestStatus, type Connection, type Participant } from '$lib/types';
import { get, getDatabase, onDisconnect, onValue, ref, set, update } from 'firebase/database';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RoomRepository = {
	id: string;
	ownerId: string;
	participants: {
		[participantId: string]: Participant;
	};
	connections: {
		[participantId: string]: Connection;
	};
};

const CodeErrors = {
	RoomNotFoundError: 'RoomNotFoundError'
};

async function publishNewRoomId(id: string, ownerId: string): Promise<void> {
	await set(ref(getDatabase(), id), {
		ownerId
	});
}

async function getRoomOwnerId(roomId: string): Promise<string> {
	const snapshot = await get(ref(getDatabase(), `${roomId}/ownerId`));
	if (!snapshot.exists()) {
		throw new Error(CodeErrors.RoomNotFoundError);
	}
	return snapshot.val();
}

function subscribeToUserChanges(
	roomId: string,
	userId: string,
	callback: (status: Participant) => void
): () => void {
	const roomRef = ref(getDatabase(), `${roomId}/participants/${userId}`);
	return onValue(
		roomRef,
		(snapshot) => callback(snapshot.val()),
		(error) => console.error(error)
	);
}

function subscribeToParticipantsChanges(
	roomId: string,
	callback: (participants: Participant[]) => void
): () => void {
	const roomRef = ref(getDatabase(), `${roomId}/participants`);
	return onValue(
		roomRef,
		(snapshot) => {
			const val: Record<string, Participant> = snapshot.val();
			const res = val
				? Object.entries(val).map(([id, participant]) => ({ ...participant, id }))
				: [];
			callback(res);
		},
		(error) => console.error(error)
	);
}

async function addNewRequestToRoom(roomId: string, user: Participant): Promise<void> {
	const db = getDatabase();
	const participantRef = ref(db, `${roomId}/participants/${user.id}`);
	onDisconnect(participantRef).remove();
	await set(participantRef, user);
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

async function saveSDPOffer(
	roomId: string,
	userId: string,
	participantId: string,
	offer: RTCSessionDescriptionInit
) {
	await set(ref(getDatabase(), `${roomId}/connections/${participantId}/${userId}/offer`), offer);
}

function awaitForSDPAnswer(
	roomId: string,
	userId: string,
	participantId: string
): Promise<RTCSessionDescription> {
	return new Promise((resolve) => {
		const answerSnapshotListenerUnsuscriber = onValue(
			ref(getDatabase(), `${roomId}/connections/${participantId}/${userId}/answer`),
			(snapshot) => {
				if (snapshot.exists()) {
					const val = snapshot.val();
					resolve(new RTCSessionDescription(val));
					answerSnapshotListenerUnsuscriber();
				}
			}
		);
	});
}

async function createNewConnectionPool(roomId: string, userId: string): Promise<void> {
	const userConnectionPoolRef = ref(getDatabase(), `${roomId}/connections/${userId}`);
	onDisconnect(userConnectionPoolRef).remove();
	await set(userConnectionPoolRef, {});
}

function subscribeToConnectionPoolChanges(
	roomId: string,
	userId: string,
	callback: (connection: Connection) => void
): () => void {
	const roomRef = ref(getDatabase(), `${roomId}/connections/${userId}`);
	return onValue(
		roomRef,
		(snapshot) => callback(snapshot.val()),
		(error) => console.error(error)
	);
}

export const roomRepository = {
	getRoomOwnerId,
	CodeErrors,
	publishNewRoomId,
	subscribeToParticipantsChanges,
	addNewRequestToRoom,
	updateParticipantStatus,
	addMediaStreamToUser,
	updateParticipantName,
	saveSDPOffer,
	awaitForSDPAnswer,
	createNewConnectionPool,
	subscribeToConnectionPoolChanges,
	subscribeToUserChanges
};
