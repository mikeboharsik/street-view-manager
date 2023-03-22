import { toast } from 'react-toastify';

import updatePhoto from './updatePhoto';

export default async function updateCoordinates(dispatch, curPhoto, coordinatesInput) {
	const { photoId: { id: photoId }, pose: { latLngPair } } = curPhoto;
	const { current: { value: newCoordinates } } = coordinatesInput;

	const [lat, lng] = newCoordinates.replace(' ', '').split(',');

	latLngPair.latitude = lat;
	latLngPair.longitude = lng;

	const options = { body: curPhoto, photoId, query: { updateMask: 'pose.latLngPair' } };
	delete options.body.pose.level; // fix API complaining about this being an empty object :\

	try {
		await updatePhoto(dispatch, options);

		toast('Updated coordinates!', { type: 'success' });
		coordinatesInput.current.value = '';
	} catch(e) {
		toast(e.message, { type: 'error' });
	}
}
