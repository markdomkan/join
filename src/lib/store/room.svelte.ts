import { roomRepository } from '$lib/providers/repositories/roomRepository';
import { type Participant } from '$lib/types';

let roomId = $state<string>('');
let roomOwnerId = $state<string>('');
let participants = $state<Participant[]>([]);

function getParticipant(participantId: Participant['id']): Participant {
	const participant = participants.find((participant) => participant.id === participantId);
	if (!participant) {
		throw new Error('Participant not found');
	}
	return participant;
}

export const roomStore = {
	get roomId() {
		return roomId;
	},
	get participants() {
		return participants;
	},
	get roomOwnerId() {
		return roomOwnerId;
	},
	addNewParticipant: async (participant: Participant): Promise<void> => {
		participants = [...participants, participant];
		await roomRepository.addNewRequestToRoom(roomId, participant);
	},
	init: (id: string, ownerId: string): void => {
		roomId = id;
		roomOwnerId = ownerId;
		const unsubscriber = roomRepository.subscribeToParticipantsChanges(
			roomId,
			(newParticipants) => (participants = newParticipants)
		);
		$effect.root(() => unsubscriber);
	},
	setAllParticipants: async (newParticipants: Participant[]): Promise<void> => {
		participants = newParticipants;
	},
	updateParticipantStatus: async (
		participantId: Participant['id'],
		status: Participant['status']
	): Promise<void> => {
		const participant = getParticipant(participantId);
		await roomRepository.updateParticipantStatus(roomId, participant.id, status);
		participant.status = status;
	},
	updateParticipantName: async (
		participantId: Participant['id'],
		name: Participant['name']
	): Promise<void> => {
		const participant = getParticipant(participantId);
		await roomRepository.updateParticipantName(roomId, participant.id, name);
		participant.name = name;
	}
};
