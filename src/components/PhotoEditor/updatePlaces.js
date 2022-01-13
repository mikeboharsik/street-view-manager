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

	try {
		await updatePhoto(dispatch, options);

		placesInput.current.value = 'OK';
	} catch(e) {
		placesInput.current.value = `ERROR: ${e}`;
	}
}
