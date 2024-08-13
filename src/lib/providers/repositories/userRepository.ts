const CLIENT_NAME_KEY = 'clientName';

function saveUserName(name: string): void {
	localStorage.setItem(CLIENT_NAME_KEY, name);
}

function getUserName(): string {
	return localStorage.getItem(CLIENT_NAME_KEY) || '';
}

function clearUserName(): void {
	localStorage.removeItem(CLIENT_NAME_KEY);
}

export const userRepository = {
	saveUserName,
	getUserName,
	clearUserName
};
