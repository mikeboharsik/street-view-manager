import { toast } from 'react-toastify';

import selectUploads from '../GlobalState/selectors/selectUploads';

import { ACTIONS } from '../GlobalState/reducers/global';

import { fetcher, ACTIONS as FETCHER_ACTIONS } from '../../utilities';

// https://developers.google.com/streetview/publish/reference/rest/v1/Code
const ERROR_CODES = {
	OK: 0,
	CANCELLED: 1,
	UNKNOWN: 2,
	INVALID_ARGUMENT: 3,
	DEADLINE_EXCEEDED: 4,
	NOT_FOUND: 5,
	ALREADY_EXISTS: 6,
	PERMISSION_DENIED: 7,
	UNAUTHENTICATED: 8,
	RESOURCE_EXHAUSTED: 9,
	FAILED_PRECONDITION: 10,
	ABORTED: 11,
	OUT_OF_RANGE: 12,
	UNIMPLEMENTED: 13,
	INTERNAL: 14,
	UNAVAILABLE: 15,
	DATA_LOSS: 16,
};

export default function getDeleteHandler(dispatch, state) {
	return async function handleDelete() {
		const { multiselect: { ids } } = selectUploads(state);

		if (ids.length <= 0) {
			return;
		}

		const body = { photoIds: ids };

		try {
			const action = FETCHER_ACTIONS.DELETE_PHOTOS;
			const options = { body };

			const res = await fetcher(action, options).then((res) => res.json());
			const { status: statuses } = res;

			const idsToRemove = statuses.reduce((acc, status, idx) => {
				const { code } = status;
				const photoId = ids[idx];

				if (!code || code === ERROR_CODES.OK) {
					acc.push(photoId);
				} else {
					console.error(`Deletion of photo ${photoId} failed`, status);
				}

				return acc;
			}, []);

			const wasPartialSuccess = idsToRemove.length > 0;
			const wasTotalSuccess = idsToRemove === ids.length;

			if (!wasTotalSuccess) {
				toast('Failed to delete requested photos', { autoClose: false, type: 'error' });
			} else if (!wasPartialSuccess) {
				toast('Failed to delete some photos', { autoClose: false, type: 'warning' })
			}

			if (wasPartialSuccess) {
				dispatch({ payload: { photoIds: idsToRemove }, type: ACTIONS.DELETE_PHOTOS });
			}
		} catch (e) {
			console.error({ e });
			toast(e.message, { autoClose: false, type: 'error' });
		}
	}
}
