const CLIENT_NAME_KEY = 'clientName';

export async function saveUserName(name: string): Promise<void> {
	localStorage.setItem(CLIENT_NAME_KEY, name);
}

export async function getUserName(): Promise<string> {
	return localStorage.getItem(CLIENT_NAME_KEY) || '';
}

export async function clearUserName(): Promise<void> {
	localStorage.removeItem(CLIENT_NAME_KEY);
}
