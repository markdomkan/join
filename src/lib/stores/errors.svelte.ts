export type JoinError = {
	message: string;
};

export const errors: JoinError[] = $state([]);

export function addError(message: string) {
	errors.push({ message });
}
