import { getAuth } from 'firebase/auth';

function getUserId() {
	const auth = getAuth();
	if (!auth.currentUser) {
		throw new Error('User is not authenticated');
	}
	return auth.currentUser.uid;
}

export const authProvider = {
	getUserId
};
