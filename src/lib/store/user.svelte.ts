import { InMemoryBus } from '@markdomkan/in-memory-bus';

export const userEventBus = new InMemoryBus<{
	'id-updated': string;
	'name-updated': string;
	'media-stream-updated': MediaStream | null;
}>();

let userId = $state<string>('');
let userName = $state<string>('');
let userMediaStream = $state<MediaStream | null>(null);
const nameIsEmpty = $derived(userName === '');

export const userStore = {
	get id() {
		return userId;
	},
	get name() {
		return userName;
	},
	get mediaStream() {
		return userMediaStream;
	},
	get nameIsEmpty() {
		return nameIsEmpty;
	},
	setId: async (id: string): Promise<void> => {
		if (userId !== undefined) {
			await userEventBus.emitAwaitParallel('id-updated', userId);
			userId = id;
		}
	},
	setName: async (newName: string): Promise<void> => {
		if (newName === undefined) {
			newName = '';
		}
		await userEventBus.emitAwaitParallel('name-updated', newName);
		userName = newName;
	},
	setMediaStream: async (stream: MediaStream | null): Promise<void> => {
		if (userMediaStream !== null) {
			await userEventBus.emitAwaitParallel('media-stream-updated', stream);
			userMediaStream = stream;
		}
	}
};
