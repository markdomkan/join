import { roomStore } from '$lib/store/room.svelte';

const rtcConfig = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		{ urls: 'stun:stun1.l.google.com:19302' },
		{ urls: 'stun:stun2.l.google.com:19302' },
		{ urls: 'stun:stun3.l.google.com:19302' },
		{ urls: 'stun:stun4.l.google.com:19302' }
	]
};

function addLocalTracks(rtcPeerConnection: RTCPeerConnection, mediaStream: MediaStream): void {
	if (!mediaStream) {
		return;
	}
	for (const track of mediaStream.getTracks()) {
		rtcPeerConnection.addTrack(track, mediaStream);
	}
}

export async function createNewOffer(
	mediaStream: MediaStream,
	participantId: string
): Promise<void> {
	const rtcPeerConnection = new RTCPeerConnection(rtcConfig);
	addLocalTracks(rtcPeerConnection, mediaStream);
    
	// handle events
	rtcPeerConnection.ontrack = (a) => {
		console.log('ª');
		console.log(a);
	};
	rtcPeerConnection.onicecandidate = (event) => {
		console.log('onicecandidate', event);
	};

	// create offer
	const sessionDescription = await rtcPeerConnection.createOffer();
	rtcPeerConnection.setLocalDescription(sessionDescription);

	// save the session description to firebase
	const sdpAnswer = await roomStore.startSDPConnectionAndAwaitForTheAnswer(
		sessionDescription,
		participantId
	);

	rtcPeerConnection.setRemoteDescription(sdpAnswer);
}

// webrtc_offer
// webrtc_answer
// webrtc_ice_candidate
