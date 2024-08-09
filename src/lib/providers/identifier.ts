import { ulid } from 'ulid';

export function createRoomIdentifier() {
	return ulid();
}

export function createClientIdentifier() {
	return ulid();
}
