import { toast } from 'react-toastify';

import selectUploads from '../GlobalState/selectors/selectUploads';

import { fetcher, ACTIONS as FETCHER_ACTIONS } from '../../utilities';

export default function getConnectHandler(state) {
	return async function handleConnect() {
		const { multiselect: { ids }, photos } = selectUploads(state);

		if (ids.length <= 0) {
			return;
		}

		const res = window.confirm(`Are you sure you want to connect the ${ids.length} photos you selected?`)
		if (!res) {
			return;
		}

		const photosToConnect = photos.filter((photo) => ids.includes(photo.photoId.id));
		photosToConnect.sort((a, b) => a.captureTime < b.captureTime ? -1 : a.captureTime > b.captureTime ? 1 : 0);

		photosToConnect.forEach((photo, idx, arr) => {
			const newConnections = [];

			const prevIdx = idx - 1;
			const nextIdx = idx + 1;

			if (prevIdx >= 0) {
				const { photoId: { id } } = arr[prevIdx];
				newConnections.push({ target: { id } });
			}

			if (nextIdx < arr.length) {
				const { photoId: { id } } = arr[nextIdx];
				newConnections.push({ target: { id } });
			}

			photo.connections = newConnections;
		});

		const body = {};

		body.updatePhotoRequests = photosToConnect.map((photo) => ({
			photo,
			updateMask: 'connections',
		}));

		try {
			const res = await fetcher(FETCHER_ACTIONS.UPDATE_PHOTOS, { body });
			if (!res.ok) {
				toast('Update connections request was not OK', { type: 'error' });
			} else {
				toast('Update connections request succeeded', { type: 'success' });
			}
		} catch (e) {
			toast(e.message, { type: 'error' });
		}
	}
}