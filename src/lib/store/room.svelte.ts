import type { Participant } from '$lib/types';
import { InMemoryBus } from '@markdomkan/in-memory-bus';
import { userStore } from './user.svelte';

export const roomEventBus = new InMemoryBus<{
	'participant-added': Participant;
	'room-id-updated': string;
	'owner-id-updated': string;
	'participants-updated': Participant[];
	'participant-status-updated': Participant;
}>();

let roomId = $state<string>('');
let roomOwnerId = $state<string>('');
let participants = $state<Participant[]>([]);
const userIsParticipant = $derived(
	participants.some((participant) => participant.id === userStore.id)
);

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
	get userIsParticipant() {
		return userIsParticipant;
	},
	addParticipant: async (participant: Participant): Promise<void> => {
		participants = [...participants, participant];
		await roomEventBus.emitAwaitParallel('participant-added', participant);
	},
	setRoomId: async (id: string): Promise<void> => {
		await roomEventBus.emitAwaitParallel('room-id-updated', id);
		roomId = id;
	},
	setRoomOwnerId: async (id: string): Promise<void> => {
		await roomEventBus.emitAwaitParallel('owner-id-updated', id);
		roomOwnerId = id;
	},
	setAllParticipants: async (newParticipants: Participant[]): Promise<void> => {
		console.log(newParticipants);
		await roomEventBus.emitAwaitParallel('participants-updated', newParticipants);
		participants = newParticipants;
	},
	updateParticipantStatus: async (
		id: Participant['id'],
		status: Participant['status']
	): Promise<void> => {
		const participant = participants.find((participant) => participant.id === id);
		if (!participant) {
			throw new Error('Participant not found');
		}
		await roomEventBus.emitAwaitParallel('participant-status-updated', participant);
		participant.status = status;
	}
};
