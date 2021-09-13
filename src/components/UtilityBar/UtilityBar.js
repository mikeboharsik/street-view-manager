import { useContext } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';

import { Gear, X } from '../icons';
import GlobalState from '../GlobalState';
import { FEATURE_FLAGS, useFeatureFlags, useIsAuthed } from '../../hooks';

import fetcher, { ACTIONS } from '../../utilities/fetcher';

import './UtilityBar.css';

function getUtilityBarToggle(state) {
	return function toggleUtilityBar() {
		const { setState } = state;

		setState((prev) => ({
			...prev,
			uploads: {
				...prev.uploads,
				multiselect: {
					...prev.uploads.multiselect,
					ids: !prev.uploads.multiselect.isEnabled ? prev.uploads.multiselect.ids : [],
					isEnabled: !prev.uploads.multiselect.isEnabled,
				},
			},
		}));
	}
}

function getConnectHandler(state) {
	return async function handleConnect() {
		const { uploads: { multiselect: { ids }, photos } } = state;

		if (ids.length <= 0) {
			return;
		}

		const res = window.confirm(`Are you sure you want to connect the ${ids.length} photos you selected?`)
		if (!res) {
			return;
		}

		const photosToConnect = photos.filter((photo) => ids.includes(photo.photoId.id));
		photosToConnect.sort((a, b) => a.captureTime < b.captureTime ? -1 : a.captureTime > b.captureTime ? 1 : 0);

		photosToConnect.forEach((photo, idx, arr) => {
			const newConnections = [];

			const prevIdx = idx - 1;
			const nextIdx = idx + 1;

			if (prevIdx >= 0) {
				const { photoId: { id } } = arr[prevIdx];
				newConnections.push({ target: { id } });
			}

			if (nextIdx < arr.length) {
				const { photoId: { id } } = arr[nextIdx];
				newConnections.push({ target: { id } });
			}

			photo.connections = newConnections;
		});

		const body = {};

		body.updatePhotoRequests = photosToConnect.map((photo) => ({
			photo,
			updateMask: 'connections',
		}));

		try {
			const res = await fetcher(ACTIONS.UPDATE_PHOTOS, { body });
			if (!res.ok) {
				toast('Update connections request was not OK', { type: 'error' });
			} else {
				toast('Update connections request succeeded', { type: 'success' });
			}
		} catch (e) {
			toast(e.message, { type: 'error' });
		}
	}
}

function getUpdatePlacesHandler(state) {
	return async function handleUpdatePlaces() {
		const { uploads: { multiselect: { ids }, photos } } = state;

		if (ids.length <= 0) {
			return;
		}

		const res = window.prompt(`Enter the Place IDs to apply to the ${ids.length} selected photos`);
		if (!res) {
			console.log('cancel', res);
			return;
		}

		const newPlaces = res.replace(' ', '').split(',').map((placeId) => ({ placeId }));

		const photosToUpdate = photos.filter((photo) => ids.includes(photo.photoId.id));
		photosToUpdate.forEach((photo) => {
			photo.places = newPlaces;
		});

		const body = {};
		body.updatePhotoRequests = photosToUpdate.map((photo) => ({
			photo,
			updateMask: 'places',
		}));

		try {
			const res = await fetcher(ACTIONS.UPDATE_PHOTOS, { body });
			if (!res.ok) {
				toast('Update places request was not OK', { type: 'error' });
			} else {
				toast('Update places request succeeded', { type: 'success' });
			}
		} catch (e) {
			toast(e.message, { type: 'error' });
		}
	}	
}

function getUpdateLevelHandler(state) {
	return async function handleUpdateLevel() {
		const { uploads: { multiselect: { ids }, photos } } = state;

		if (ids.length <= 0) {
			return;
		}

		const levelNumber = window.prompt(`Enter the level number (starting at 0 for ground level) to apply to the ${ids.length} selected photos`);
		if (!levelNumber) {
			return;
		}

		const levelName = window.prompt(`Enter the level name (e.g. '1') to apply to the ${ids.length} selected photos`);
		if (!levelName) {
			return;
		}

		const photosToUpdate = photos.filter((photo) => ids.includes(photo.photoId.id));
		photosToUpdate.forEach((photo) => {
			photo.pose.level = { name: levelName, number: parseInt(levelNumber) };
		});

		const body = {};
		body.updatePhotoRequests = photosToUpdate.map((photo) => ({
			photo,
			updateMask: 'pose.level',
		}));

		try {
			const res = await fetcher(ACTIONS.UPDATE_PHOTOS, { body });
			if (!res.ok) {
				toast('Update level request was not OK', { type: 'error' });
			} else {
				toast('Update level request succeeded', { type: 'success' });
			}
		} catch (e) {
			toast(e.message, { type: 'error' });
		}
	}
}

function getClearHandler(state) {
	return function handleClear() {
		const { setState, uploads: { multiselect: { ids } } } = state;

		if (ids.length <= 0) {
			return;
		}

		setState((prev) => ({
			...prev,
			uploads: {
				...prev.uploads,
				multiselect: {
					...prev.uploads.multiselect,
					ids: [],
				},
			},
		}));
	};
}

function Functions() {
	const state = useContext(GlobalState);
	const { uploads: { multiselect: { ids, isEnabled } } } = state;

	const functionClassName = `utilityBar-function-${isEnabled ? 'active' : 'inactive'}`;

	if (!isEnabled) {
		return null;
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<div className={functionClassName} onClick={getConnectHandler(state)}>Con</div>
			<div className={functionClassName} onClick={getUpdatePlacesHandler(state)}>Places</div>
			<div className={functionClassName} onClick={getUpdateLevelHandler(state)}>Level</div>
			<div className={functionClassName} onClick={getClearHandler(state)}>{`Clear (${ids.length})`}</div>
		</div>
	);
}

export default function UtilityBar() {
	const state = useContext(GlobalState);
	const { uploads: { multiselect: { isEnabled: isMultiselectEnabled } }, showLoader } = state;
	const isAuthed = useIsAuthed();

	const { pathname } = useLocation();
	const { isEnabled: isFeatureEnabled } = useFeatureFlags();

	const isUtilityBarEnabled = isFeatureEnabled(FEATURE_FLAGS.UTILITY_BAR);

	if (!isAuthed || !isUtilityBarEnabled || showLoader || pathname !== '/') {
		return null;
	}

	const className = `utilityBar-container-${isMultiselectEnabled ? 'active' : 'inactive'}`;

	const Indicator = isMultiselectEnabled ? X : Gear;

	return (
		<div className={className} id="utilityBar-container">
			<Indicator onClick={getUtilityBarToggle(state)} style={{ cursor: 'pointer' }} />

			<Functions />
		</div>
	);
}
