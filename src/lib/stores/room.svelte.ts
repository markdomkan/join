import type { Participant } from '../../types';

export const room: {
	id: string;
	ownerId: string;
	participants: Participant[];
} = $state({
	id: '',
	ownerId: '',
	participants: []
});
