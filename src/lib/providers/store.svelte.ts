import { SvelteMap } from 'svelte/reactivity';
import type { Participant, Room } from '../../types';

type Store = {
	errors: {
		message: string;
		action?: () => void | Promise<void>;
	}[];
	user: {
		id: string;
		name: string;
		mediaStream?: MediaStream;
	};
	room: Omit<Room, 'participants'> & {
		participants: SvelteMap<string, Participant>;
	};
};

export const store: Store = $state({
	errors: [],
	user: {
		id: '',
		name: '',
		mediaStream: undefined
	},
	room: {
		id: '',
		ownerId: '',
		participants: new SvelteMap()
	}
});

function parseRoom(room: Room): Store['room'] {
	return {
		...room,
		participants: new SvelteMap(
			Object.entries(room.participants ?? {}).map(([id, participant]) => [id, participant])
		)
	};
}

export const storeHelpers = {
	parseRoom
};
