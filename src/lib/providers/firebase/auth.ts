import { getAuth, signInAnonymously } from 'firebase/auth';

export async function initializeFirebaseAuth() {
	const auth = getAuth();
	await signInAnonymously(auth);
}
