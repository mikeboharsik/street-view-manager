import { toast } from 'react-toastify';

import { fetcher, ACTIONS as FETCHER_ACTIONS } from '../../utilities';

export default function getUpdatePlacesHandler(state) {
	return async function handleUpdatePlaces() {
		const { uploads: { multiselect: { ids }, photos } } = state;

		if (ids.length <= 0) {
			return;
		}

		const res = window.prompt(`Enter the Place IDs to apply to the ${ids.length} selected photos`);
		if (!res) {
			console.log('cancel', res);
			return;
		}

		const newPlaces = res.replace(' ', '').split(',').map((placeId) => ({ placeId }));

		const photosToUpdate = photos.filter((photo) => ids.includes(photo.photoId.id));
		photosToUpdate.forEach((photo) => {
			photo.places = newPlaces;
		});

		const body = {};
		body.updatePhotoRequests = photosToUpdate.map((photo) => ({
			photo,
			updateMask: 'places,pose.latLngPair',
		}));

		try {
			const res = await fetcher(FETCHER_ACTIONS.UPDATE_PHOTOS, { body });
			if (!res.ok) {
				toast('Update places request was not OK', { type: 'error' });
			} else {
				toast('Update places request succeeded', { type: 'success' });
			}
		} catch (e) {
			toast(e.message, { type: 'error' });
		}
	}	
}