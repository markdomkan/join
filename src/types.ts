export type Participant = {
	name: string;
	status: RequestStatus;
	mediaStream?: MediaStream;
};

export const enum RequestStatus {
	Waiting = 'waiting',
	Accepted = 'accepted',
	Rejected = 'rejected'
}

export type Room = { id: string; ownerId: string; participants?: { [id: string]: Participant } };
