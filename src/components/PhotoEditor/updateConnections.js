import { toast } from 'react-toastify';

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
	delete options.body.pose.level; // fix API complaining about this being an empty object :\

	try {
		await updatePhoto(dispatch, options);

		toast('Updated connections!', { type: 'success' });
		connectionsInput.current.value = '';
	} catch(e) {
		toast(e.message, { type: 'error' });
	}
}
