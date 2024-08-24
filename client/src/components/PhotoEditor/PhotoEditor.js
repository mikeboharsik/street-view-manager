import { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import GlobalState from '../GlobalState';

import Connections from './Connections';
import Places from './Places';

import getPhoto from './getPhoto';
import updateAltitude from './updateAltitude';
import updateConnections from './updateConnections';
import updateCoordinates from './updateCoordinates';
import updatePlaces from './updatePlaces';

import './PhotoEditor.css'

export default function PhotoEditor({ match }) {
	const history = useHistory();

	const { params: { photoId } } = match;
	if (!photoId) {
		history.push('/');
	}

	const { dispatch, state: { uploads: { photos } } } = useContext(GlobalState);
	const coordinatesInput = useRef(null);
	const altitudeInput = useRef(null);
	const placesInput = useRef(null);
	const connectionsInput = useRef(null);

	const [curPhoto, setCurPhoto] = useState(null);

	const { location: { pathname } } = history;
	useEffect(() => {
		[coordinatesInput, altitudeInput, placesInput, connectionsInput]
			.forEach((i) => {
				if (i.current) i.current.value = '';
			});
	}, [pathname]);

	useEffect(() => {
		const photo = photos?.find(p => p?.photoId?.id === photoId);
		if (photo) {
			setCurPhoto(photo);

			return;
		}

		getPhoto(dispatch, photoId);
	}, [dispatch, photoId, photos]);

	if (curPhoto) {
		const {
			pose: { altitude, latLngPair: { latitude, longitude }, level },
			shareLink,
			thumbnailUrl,
			viewCount,
		} = curPhoto;

		return (
			<div id="editor">
				<div className="header" data-testid="editor-header">
					Editor
				</div>

				<div style={{ marginTop: '2em' }}>
					<img alt="" src={thumbnailUrl} />
				</div>
	
				<div id="photoeditor-metadata-container">
					<span>
						Views: <a target="_blank" rel="noreferrer" href={shareLink}>{viewCount || 'N/A'}</a>
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
						Level: {level ? `${level.name} (${level.number})` : 'None'}
					</span>
					<br />

					<span>
						Altitude: {`${typeof altitude === 'number' ? altitude?.toFixed(3) : '?'} m`}
					</span>
					<br />

					<Places curPhoto={curPhoto} />
					<br />

					
					<Connections curPhoto={curPhoto} />
					<br />
					<br />

					<div>
						<input type="text" ref={coordinatesInput} placeholder="Update coordinates here" />
						<button type="submit" onClick={() => updateCoordinates(dispatch, curPhoto, coordinatesInput)}>Submit</button>
					</div>

					<div>
						<input type="text" ref={altitudeInput} placeholder="Update altitude here" />
						<button type="submit" onClick={() => updateAltitude(dispatch, curPhoto, altitudeInput)}>Submit</button>
					</div>

					<div>
						<input type="text" ref={connectionsInput} placeholder="Update connections here" />
						<button type="submit" onClick={() => updateConnections(dispatch, curPhoto, connectionsInput)}>Submit</button>
					</div>

					<div>
						<input type="text" ref={placesInput} placeholder="Update places here" />
						<button type="submit" onClick={() => updatePlaces(dispatch, curPhoto, placesInput)}>Submit</button>
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
