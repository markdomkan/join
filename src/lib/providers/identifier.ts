import { ulid } from 'ulid';

function create() {
	return ulid();
}

export const idProvider = {
	create
};
