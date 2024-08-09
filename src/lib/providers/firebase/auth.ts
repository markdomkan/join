import { getAuth, signInAnonymously } from 'firebase/auth';

export async function initializeFirebaseAuth() {
	const auth = getAuth();
	await signInAnonymously(auth);
}

export function getUserId() {
	const auth = getAuth();
	if (!auth.currentUser) {
		throw new Error('User is not authenticated');
	}
	return auth.currentUser.uid;
}
