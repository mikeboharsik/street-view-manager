import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';
import getPhotos from './getPhotos';
import useFeatureFlags, { FEATURE_FLAGS } from '../../hooks/useFeatureFlags';

import { PhotosNav, Thumbnails } from '.';

import './Landing.css';

function AddPhotosLink() {
	const { isEnabled } = useFeatureFlags();
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
	const { fetcher: { photos: { inProgress } }, isAuthed, setState, uploads: { photos } } = useContext(GlobalState);

	useEffect(() => {
		if (isAuthed && inProgress === null) {
			getPhotos(setState);

			return;
		}
	}, [inProgress, isAuthed, photos, setState]);

	if (!isAuthed || !photos || inProgress) {
		return null;
	}

	return (
		<>
			<div className="header">
				<span>
					Photos
					<AddPhotosLink />
				</span>
			</div>

			<Thumbnails photos={photos} />

			<PhotosNav />
		</>
	);
}
