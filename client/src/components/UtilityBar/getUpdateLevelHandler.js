import { toast } from 'react-toastify';

import { fetcher, ACTIONS as FETCHER_ACTIONS } from '../../utilities';

export default function getUpdateLevelHandler(state) {
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
			const res = await fetcher(FETCHER_ACTIONS.UPDATE_PHOTOS, { body });
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