import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';
import getPhotos from './getPhotos';
import { useIsAuthed } from '../../hooks';
import { initiateAuthenticationFlow } from '../../utilities';

import { PhotosNav, Thumbnails } from '.';

import selectFetcher from '../GlobalState/selectors/selectFetcher';
import selectAuthFlow from '../GlobalState/selectors/selectAuthFlow';

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
	const authFlow = selectAuthFlow(state);

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
		switch (authFlow.inProgress) {
			case null: {
				return (
					<>
						<div style={{ width: '25%', textAlign: 'center' }}>
							This application needs your permission to access the Street View content associated with your Google account
						</div>
						<br />
						<div>
							<span
								data-testid="link-grant-access"
								onClick={() => handleAuthenticationClick({ ...handleAuthenticationClickArgs })}
								style={{ cursor: 'pointer', textDecoration: 'underline' }}
							>
								Click here to grant permission
							</span>
						</div>
					</>
				);
			}
			case true: {
				return (
					<>
						<div>
							<span>
								Authenticating...
							</span>
						</div>
					</>
				);
			}
			default: {
				return null;
			}
		}
	}

	return (
		<>
			<div className="header" data-testid="landing-header">
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
