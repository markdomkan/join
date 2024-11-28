export type Participant = {
	id: string;
	name: string;
	status: RequestStatus;
};

export const enum RequestStatus {
	Waiting = 'waiting',
	Accepted = 'accepted',
	Rejected = 'rejected'
}

export type Connection = {
	[participantId: string]: {
		offer: RTCSessionDescriptionInit;
		answer?: RTCSessionDescriptionInit;
		candidates?: RTCIceCandidateInit[];
	};
};

export type Room = { id: string; ownerId: string; participants?: { [id: string]: Participant } };
