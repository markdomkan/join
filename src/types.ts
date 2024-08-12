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
