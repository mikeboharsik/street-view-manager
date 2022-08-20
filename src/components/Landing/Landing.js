import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';
import getPhotos from './getPhotos';
import { useIsAuthed } from '../../hooks';
import { initiateAuthenticationFlow } from '../../utilities';

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

function handleAuthenticationClick(...args) {
	initiateAuthenticationFlow(...args);
}

export default function Landing() {
	const isAuthed = useIsAuthed();

	const { dispatch, state } = useContext(GlobalState);

	const [authInterval, setAuthInterval] = useState(null);
	const authIntervalRef = useRef(null);

	const { inProgress } = selectFetcher(state, 'photos');

	useEffect(() => {
		authIntervalRef.current = authInterval
	});

	const handleAuthenticationClickArgs = { authIntervalRef, dispatch, setAuthInterval };

	useEffect(() => {
		if (dispatch && isAuthed && inProgress === null) {
			getPhotos(dispatch);
		}
	}, [dispatch, inProgress, isAuthed]);

	if (isAuthed === null || inProgress === true) {
		return null;
	}

	if (isAuthed === false) {
		return (
			<>
				<div style={{ width: '25%', textAlign: 'center' }}>
					This application needs your permission to access the Street View content associated with your Google account
				</div>
				<br />
				<div>
					<span
						data-cy="link-grant-access"
						onClick={() => handleAuthenticationClick({ ...handleAuthenticationClickArgs })}
						style={{ cursor: 'pointer', textDecoration: 'underline' }}
					>
						Click here to grant permission
					</span>
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
