import initializeFirebase from './firebase';
import { initializeFirebaseAuth } from './firebase/auth';

export default async function initializeProviders() {
	await initializeFirebase();
	await initializeFirebaseAuth();
}
