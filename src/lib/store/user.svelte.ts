import { userRepository } from '$lib/providers/repositories/userRepository';

let userId = $state<string>('');
let userName = $state<string>('');
let userMediaStream = $state<MediaStream | null>(null);
const nameIsEmpty = $derived(userName === '');

async function setId(id: string): Promise<void> {
	if (id !== undefined) {
		userId = id;
	}
}

async function setName(newName: string): Promise<void> {
	if (newName === undefined) {
		newName = '';
	}
	userName = newName;
	userRepository.saveUserName(newName);
}

async function setMediaStream(stream: MediaStream | null): Promise<void> {
	if (!stream) {
		return;
	}
	// set media stream into roomRepository
	userMediaStream = stream;
}

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
	setId,
	setName,
	setMediaStream
};
