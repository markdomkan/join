<script lang="ts">
	import { addError } from '$lib/stores/errors.svelte';
	import { mediaStreams } from '$lib/stores/mediaStreams.svelte';

	let devices: MediaDeviceInfo[] = $state([]);
	const videoInputDevices = $derived(devices.filter((device) => device.kind === 'videoinput'));
	const audioInputDevices = $derived(devices.filter((device) => device.kind === 'audioinput'));
	let videoInputDeviceId: string | undefined = $state(undefined);
	let audioInputDeviceId: string | undefined = $state(undefined);

	$effect(() => void createMediaStreamWithSelectedDevices());

	async function createMediaStreamWithSelectedDevices() {
		if (!videoInputDeviceId || !audioInputDeviceId) {
			return;
		}
		const mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				deviceId: audioInputDeviceId ? { exact: audioInputDeviceId } : undefined
			},
			video: {
				width: 1280,
				height: 720,
				deviceId: videoInputDeviceId ? { exact: videoInputDeviceId } : undefined
			}
		});
		mediaStreams.user = mediaStream;
	}

	async function getAvailableDevices() {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			devices = await navigator.mediaDevices.enumerateDevices();
		} catch (error) {
			const errors: Record<string, string> = {
				NotAllowedError: 'You have denied access to the camera or microphone',
				NotFoundError: 'It seems that there are no video or audio devices available',
				default: 'An error occurred while trying to get the available devices'
			};
			addError(errors[(error as Error).name] || `${errors.default}: ${(error as Error).message}`);
		}
	}
</script>

<section>
	{#await getAvailableDevices()}
		<p>Loading devices...</p>
	{:then}
		<div>
			<label
				>Video devices
				<select bind:value={videoInputDeviceId}>
					{#each videoInputDevices as device}
						<option value={device.deviceId}>{device.label}</option>
					{/each}
				</select>
			</label>
			<label
				>Audio input devices
				<select bind:value={audioInputDeviceId}>
					{#each audioInputDevices as device}
						<option value={device.deviceId}>{device.label}</option>
					{/each}
				</select>
			</label>
		</div>
	{/await}
</section>
