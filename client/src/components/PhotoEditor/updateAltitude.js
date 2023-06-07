import { toast } from 'react-toastify';

import updatePhoto from './updatePhoto';

export default async function updateAltitude(dispatch, curPhoto, altitudeInput) {
	const { photoId: { id: photoId }, pose } = curPhoto;
	const { current: { value: newAltitude } } = altitudeInput;
	pose.altitude = parseFloat(newAltitude);

	const options = { body: curPhoto, photoId, query: { updateMask: 'pose.latLngPair,pose.altitude' } };
	delete options.body.pose.level; // fix API complaining about this being an empty object :\

	try {
		await updatePhoto(dispatch, options);

		toast('Success!', { type: 'success' });
		altitudeInput.current.value = '';
	} catch(e) {
		toast(e.message, { type: 'error' });
	}
}
