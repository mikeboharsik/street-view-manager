import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';
import getPhotos from './getPhotos';
import { useIsAuthed } from '../../hooks';
import { FEATURE_FLAGS, getAuthUri, getFeatureFlags } from '../../utilities';

import { PhotosNav, Thumbnails } from '.';

import { selectPhotos } from '../GlobalState/selectors/selectUploads';
import selectFetcher from '../GlobalState/selectors/selectFetcher';

import './Landing.css';

function AddPhotosLink() {
	const { isEnabled } = getFeatureFlags();
	const isAddPhotosEnabled = isEnabled(FEATURE_FLAGS.ADD_PHOTOS);

	if (isAddPhotosEnabled) {
		return (
			<span style={{ fontWeight: 'bold', paddingLeft: '16px', position: 'absolute' }}>
				<Link style={{ textDecoration: 'none' }} to="/photoUploader">+</Link>
			</span>
		);
	}

	return null;
}

export default function Landing() {
	const isAuthed = useIsAuthed();

	const { dispatch, state } = useContext(GlobalState);

	const { inProgress } = selectFetcher(state, 'photos');
	const photos = selectPhotos(state);

	useEffect(() => {
		if (isAuthed && inProgress === null) {
			getPhotos(dispatch);

			return;
		}
	}, [dispatch, inProgress, isAuthed, photos]);

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
