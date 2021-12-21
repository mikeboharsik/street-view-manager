import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';
import getPhotos from './getPhotos';
import { useIsAuthed } from '../../hooks';
import { getAuthUri } from '../../utilities';

import { PhotosNav, Thumbnails } from '.';

import selectFetcher from '../GlobalState/selectors/selectFetcher';

import './Landing.css';

function AddPhotosLink() {
	return (
		<span style={{ fontWeight: 'bold', paddingLeft: '16px', position: 'absolute' }}>
			<Link style={{ textDecoration: 'none' }} title="Upload" to="/upload">+</Link>
		</span>
	);
}

export default function Landing() {
	const isAuthed = useIsAuthed();

	const { dispatch, state } = useContext(GlobalState);

	const { inProgress } = selectFetcher(state, 'photos');

	useEffect(() => {
		if (dispatch && isAuthed && inProgress === null) {
			getPhotos(dispatch);
		}
	}, [dispatch, inProgress, isAuthed]);

	if (isAuthed === null || inProgress === true) {
		return null;
	}

	if (isAuthed === false) {
		const authUri = getAuthUri();

		return (
			<>
				<div style={{ width: '25%', textAlign: 'center' }}>
					This application needs your permission to access the Street View content associated with your Google account
				</div>
				<br />
				<div>
					<a data-cy="link-grant-access" href={authUri}>
						Click here to grant permission
					</a>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="header">
				<span>
					Photos
					<AddPhotosLink />
				</span>
			</div>

			<Thumbnails />

			<PhotosNav />
		</>
	);
}
