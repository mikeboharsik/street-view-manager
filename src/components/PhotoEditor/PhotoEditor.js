import { useContext, useEffect, useRef, useState } from 'react';
import GlobalState from '../GlobalState';
import { Link, useHistory } from 'react-router-dom';
import fetcher, { ACTIONS } from '../../utilities/fetcher';
import checkAccessToken from '../../utilities/checkAccessToken';

import './PhotoEditor.css'

export default function PhotoEditor({ match }) {
	checkAccessToken();

	const history = useHistory();

	const { params: { photoId } } = match;
	if (!photoId) {
		history.push('/');
	}

	const { setState, uploads: { photos } } = useContext(GlobalState);
	const coordinatesInput = useRef(null);
	const altitudeInput = useRef(null);
	const placesInput = useRef(null);
	const connectionsInput = useRef(null);

	const [curPhoto, setCurPhoto] = useState(null);

	async function updatePhoto(options) {
		const res = await fetcher(ACTIONS.UPDATE_PHOTO, options);
		if (!res.ok) {
			console.error(await res.json());
			throw res.status;
		}
	}

	async function updateCoordinates() {
		const { pose: { latLngPair } } = curPhoto;
		const { current: { value: newCoordinates } } = coordinatesInput;

		const [lat, lng] = newCoordinates.replace(' ', '').split(',');

		latLngPair.latitude = lat;
		latLngPair.longitude = lng;

		const options = { body: curPhoto, photoId, query: { updateMask: 'pose.latLngPair' } };

		try {
			await updatePhoto(options);

			coordinatesInput.current.value = 'OK';
		} catch(e) {
			coordinatesInput.current.value = `ERROR: ${e}`;
		}
	}

	async function updateAltitude() {
		const { pose } = curPhoto;
		const { current: { value: newAltitude } } = altitudeInput;
		pose.altitude = parseFloat(newAltitude);

		const options = { body: curPhoto, photoId, query: { updateMask: 'pose.latLngPair,pose.altitude' } };

		try {
			await updatePhoto(options);

			altitudeInput.current.value = 'OK';
		} catch(e) {
			altitudeInput.current.value = `ERROR: ${e}`;
		}
	}

	async function updatePlaces() {
		let { current: { value: newPlaces } } = placesInput;
		
		newPlaces = newPlaces.replace(' ', '')
		if (newPlaces === '') {
			newPlaces = [];
		} else {
			newPlaces = newPlaces.split(',').map((place) => ({ placeId: place }));
		}

		const updatedPhoto = JSON.parse(JSON.stringify(curPhoto));
		updatedPhoto.places = newPlaces;

		const options = { body: updatedPhoto, photoId, query: { updateMask: 'places' } };

		try {
			await updatePhoto(options);

			const newPhotos = [...photos];
			const photoIdx = newPhotos.findIndex((p) => p.photoId.id === photoId);

			newPhotos[photoIdx] = updatedPhoto;

			setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: newPhotos } } ));

			placesInput.current.value = 'OK';
		} catch(e) {
			placesInput.current.value = `ERROR: ${e}`;
		}
	}

	async function updateConnections() {
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
			await updatePhoto(options);

			const newPhotos = [...photos];
			const photoIdx = newPhotos.findIndex((p) => p.photoId.id === photoId);

			newPhotos[photoIdx] = updatedPhoto;

			setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: newPhotos } } ));

			connectionsInput.current.value = 'OK';
		} catch(e) {
			connectionsInput.current.value = `ERROR: ${e}`;
		}
	}

	useEffect(() => {
		const photo = photos?.find(p => p?.photoId?.id === photoId);
		if (photo) {
			setCurPhoto(photo);

			return;
		}

		async function getPhoto() {
			const res = await fetcher(ACTIONS.GET_PHOTO, { photoId }).then((res) => res.json());

			setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: prev.uploads.photos ? [res, ...prev.uploads.photos] : [res] } }));
		}
		getPhoto();
	}, [photoId, photos, setState]);

	if (curPhoto) {
		const {
			connections,
			places,
			pose: { altitude, latLngPair: { latitude, longitude } },
			shareLink,
			thumbnailUrl,
			viewCount,
		} = curPhoto;

		return (
			<div id="editor">
				<div className="header">
					Editor
				</div>

				<div style={{ marginTop: '2em' }}>
					<img alt="" src={thumbnailUrl} />
				</div>
	
				<div id="photoeditor-metadata-container">
					<span>
						Views: <a target="_blank" rel="noreferrer" href={shareLink}>{viewCount}</a>
					</span>
					<br />

					<span>
						Coordinates:
						&nbsp;
						<a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/${latitude},+${longitude}`}>
							{`${latitude}, ${longitude}`}
						</a>
						</span>
					<br />

					<span>
						Altitude: {`${typeof altitude === 'number' ? altitude?.toFixed(3) : '?'} m`}
					</span>
					<br />

					<span>
						Places: {
							(places?.length && places.map((p) =>
								<span
									style={{ cursor: 'pointer' }}
									key={p.placeId}
									placeid={p.placeId}
									onClick={(evt) => {
										const placeId = evt.target.getAttribute('placeid');
										document.querySelector('#copy').value = placeId;
										document.querySelector('#copy').select();
										document.execCommand('copy');
										document.querySelector('#copy').value = null;
								}}>
									{p.name || p.placeId}
									&nbsp;&nbsp;
								</span>
							)) || 'None '
						}
						<a target="_blank" rel="noreferrer" href="https://developers.google.com/maps/documentation/places/web-service/place-id">
							(?)
						</a>
						<input style={{ opacity: 0, position: 'absolute' }} type="text" id="copy" />
					</span>
					<br />

					<span>
						Connections: {connections?.map(
							(c) => <><Link key={c.target.id} to={`/photoEditor/${c.target.id}`}>{`${c.target.id.slice(0, 5)}...${c.target.id.slice(59, 64)}`}</Link><span>&nbsp;&nbsp;</span></>) || 'None'
						}
					</span>
					<br />
					<br />

					<div>
						<input type="text" ref={coordinatesInput} placeholder="Update coordinates here" />
						<button type="submit" onClick={updateCoordinates}>Submit</button>
					</div>

					<div>
						<input type="text" ref={altitudeInput} placeholder="Update altitude here" />
						<button type="submit" onClick={updateAltitude}>Submit</button>
					</div>

					<div>
						<input type="text" ref={placesInput} placeholder="Update places here" />
						<button type="submit" onClick={updatePlaces}>Submit</button>
					</div>

					<div>
						<input type="text" ref={connectionsInput} placeholder="Update connections here" />
						<button type="submit" onClick={updateConnections}>Submit</button>
					</div>

					<span style={{ cursor: 'pointer', fontSize: 42, fontWeight: 'bold' }} onClick={() => { history.push('/'); }}>
						←
					</span>
				</div>
			</div>
		);
	}

	return null;
}
