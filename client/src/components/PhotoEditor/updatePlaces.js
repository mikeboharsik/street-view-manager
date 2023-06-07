import { toast } from 'react-toastify';

import updatePhoto from './updatePhoto';

export default async function updatePlaces(dispatch, curPhoto, placesInput) {
	const { photoId: { id: photoId } } = curPhoto;
	let { current: { value: newPlaces } } = placesInput;
	
	newPlaces = newPlaces.replace(' ', '')
	if (newPlaces === '') {
		newPlaces = [];
	} else {
		newPlaces = newPlaces.split(',').map((place) => ({ placeId: place }));
	}

	const updatedPhoto = JSON.parse(JSON.stringify(curPhoto));
	updatedPhoto.places = newPlaces;

	const options = { body: updatedPhoto, photoId, query: { updateMask: 'places,pose.latLngPair' } };
	delete options.body.pose.level; // fix API complaining about this being an empty object :\

	try {
		await updatePhoto(dispatch, options);

		toast('Updated places!', { type: 'success' });
		placesInput.current.value = '';
	} catch(e) {
		toast(e.message, { type: 'error' });
	}
}
