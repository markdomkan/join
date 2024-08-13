import initializeFirebase from './firebase';
import { initializeFirebaseAuth } from './firebase/auth';

async function init() {
	await initializeFirebase();
	await initializeFirebaseAuth();
}

export const providers = {
	init
};
