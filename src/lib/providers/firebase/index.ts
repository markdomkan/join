import { initializeApp } from 'firebase/app';

export default function initializeFirebase() {
	initializeApp({
		apiKey: 'AIzaSyB0loYFTid7O-_XgNgfs1CCePSiuB19qNA',
		authDomain: 'join-797a6.firebaseapp.com',
		projectId: 'join-797a6',
		storageBucket: 'join-797a6.appspot.com',
		messagingSenderId: '206766478727',
		appId: '1:206766478727:web:0c01f08858d0c37ebeaf22',
		databaseURL: 'https://join-797a6-default-rtdb.europe-west1.firebasedatabase.app'
	});
}
