import updatePhoto from './updatePhoto';

export default async function updateConnections(dispatch, curPhoto, connectionsInput) {
	const { photoId: { id: photoId } } = curPhoto;
	let { current: { value: newConnections } } = connectionsInput;

	newConnections = newConnections.replace(' ', '')
	if (newConnections === '') {
		newConnections = [];
	} else {
		newConnections = newConnections.split(',').map((connection) => ({ target: { id: connection } }));
	}

	const updatedPhoto = JSON.parse(JSON.stringify(curPhoto));
	updatedPhoto.connections = newConnections;

	const options = { body: updatedPhoto, photoId, query: { updateMask: 'connections' } };

	try {
		await updatePhoto(dispatch, options);

		connectionsInput.current.value = 'OK';
	} catch(e) {
		connectionsInput.current.value = `ERROR: ${e}`;
	}
}
