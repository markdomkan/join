import { authProvider } from '$lib/providers/auth';
import { roomRepository } from '$lib/providers/repositories/roomRepository';
import { RequestStatus, type Connection, type Participant } from '$lib/types';

const internal_symbol = Symbol('internal');

type RoomParticipant = Participant & {
	[internal_symbol]?: {
		hasOffer: boolean;
	};
};

let roomId = $state<string>('');
let roomOwnerId = $state<string>('');
let participants = $state<{ [participantId: string]: RoomParticipant }>({});
let connectionPoolCreated = $state<boolean>(false);
const cleanUps = $state<(() => void)[]>([]);

function getParticipant(participantId: RoomParticipant['id']): RoomParticipant {
	if (!participants[participantId]) {
		throw new Error('Participant not found');
	}
	return participants[participantId];
}

function reduceParticipants(participantsArray: Participant[]): typeof participants {
	return participantsArray.reduce<typeof participants>((acc, participant) => {
		acc[participant.id] = { ...participant };
		return acc;
	}, {});
}

async function addNewParticipant(participant: RoomParticipant): Promise<void> {
	participants = { ...participants, [participant.id]: participant };
	await roomRepository.addNewRequestToRoom(roomId, participant);
}

function init(id: string, ownerId: string): void {
	roomId = id;
	roomOwnerId = ownerId;
	const userId = authProvider.getUserId();
	if (ownerId === userId) {
		cleanUps.push(subscribeParticipantsChanges());
		return;
	}
	const participantsChangeUnsubscriber = roomRepository.subscribeToUserChanges(
		roomId,
		userId,
		(user): void => {
			if (user.status === RequestStatus.Accepted) {
				participantsChangeUnsubscriber();
				cleanUps.push(subscribeParticipantsChanges());
				return;
			}
			participants[user.id] = user;
		}
	);
}

function subscribeParticipantsChanges(): () => void {
	return roomRepository.subscribeToParticipantsChanges(
		roomId,
		(newParticipants) => (participants = reduceParticipants(newParticipants))
	);
}

async function createNewConnectionPool(
	onNewConnection: (offers: Connection) => void
): Promise<void> {
	if (connectionPoolCreated) {
		return;
	}
	connectionPoolCreated = true;
	const connectionPoolChangesUnsuscriber = roomRepository.subscribeToConnectionPoolChanges(
		roomId,
		authProvider.getUserId(),
		onNewConnection
	);
	cleanUps.push(connectionPoolChangesUnsuscriber);
	await roomRepository.createNewConnectionPool(roomId, authProvider.getUserId());
}

async function setAllParticipants(newParticipants: RoomParticipant[]): Promise<void> {
	participants = reduceParticipants(newParticipants);
}

async function updateParticipantStatus(
	participantId: RoomParticipant['id'],
	status: RoomParticipant['status']
): Promise<void> {
	const participant = getParticipant(participantId);
	await roomRepository.updateParticipantStatus(roomId, participant.id, status);
	participant.status = status;
}

async function updateParticipantName(
	participantId: RoomParticipant['id'],
	name: RoomParticipant['name']
): Promise<void> {
	const participant = getParticipant(participantId);
	await roomRepository.updateParticipantName(roomId, participant.id, name);
	participant.name = name;
}

async function startSDPConnectionAndAwaitForTheAnswer(
	sessionDescription: RTCSessionDescriptionInit,
	participantId: string
): Promise<RTCSessionDescription> {
	const { promise, resolve, reject } = Promise.withResolvers<RTCSessionDescription>();
	roomRepository
		.awaitForSDPAnswer(roomId, authProvider.getUserId(), participantId)
		.then(resolve)
		.catch(reject);
	await roomRepository.saveSDPOffer(
		roomId,
		authProvider.getUserId(),
		participantId,
		sessionDescription
	);
	return promise;
}

function cleanup(): void {
	for (const cleanUp of cleanUps) {
		cleanUp();
	}
}

export const roomStore = {
	get roomId() {
		return roomId;
	},
	get participants() {
		return Object.values(participants) as Participant[];
	},
	get roomOwnerId() {
		return roomOwnerId;
	},
	get connectionPoolCreated() {
		return connectionPoolCreated;
	},
	init,
	cleanup,
	addNewParticipant,
	setAllParticipants,
	updateParticipantStatus,
	updateParticipantName,
	startSDPConnectionAndAwaitForTheAnswer,
	createNewConnectionPool
};
