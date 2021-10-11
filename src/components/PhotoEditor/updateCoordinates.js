import updatePhoto from './updatePhoto';

export default async function updateCoordinates(dispatch, curPhoto, coordinatesInput) {
	const { photoId: { id: photoId }, pose: { latLngPair } } = curPhoto;
	const { current: { value: newCoordinates } } = coordinatesInput;

	const [lat, lng] = newCoordinates.replace(' ', '').split(',');

	latLngPair.latitude = lat;
	latLngPair.longitude = lng;

	const options = { body: curPhoto, photoId, query: { updateMask: 'pose.latLngPair' } };

	try {
		await updatePhoto(dispatch, options);

		coordinatesInput.current.value = 'OK';
	} catch(e) {
		coordinatesInput.current.value = `ERROR: ${e}`;
	}
}
