import updatePhoto from './updatePhoto';

export default async function updateAltitude(dispatch, curPhoto, altitudeInput) {
	const { photoId: { id: photoId }, pose } = curPhoto;
	const { current: { value: newAltitude } } = altitudeInput;
	pose.altitude = parseFloat(newAltitude);

	const options = { body: curPhoto, photoId, query: { updateMask: 'pose.latLngPair,pose.altitude' } };

	try {
		await updatePhoto(dispatch, options);

		altitudeInput.current.value = 'OK';
	} catch(e) {
		altitudeInput.current.value = `ERROR: ${e}`;
	}
}
