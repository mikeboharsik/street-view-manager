import { toast } from 'react-toastify';

import { ACTIONS } from '../GlobalState/reducers/global';

export default async function getGitHash(dispatch) {
	try {
		dispatch({ payload: { inProgress: true, type: 'gitHash'}, type: ACTIONS.SET_FETCHER });

		const res = await fetch('/git-version.txt').then(res => res.text());

		dispatch({ payload: { gitHash: res }, type: ACTIONS.SET_GITHASH });
	} catch(e) {
		console.error(e);

		toast(`Failed to load git hash: ${e.message}`, { type: 'error' });
	} finally {
		dispatch({ payload: { inProgress: false, type: 'gitHash' }, type: ACTIONS.SET_FETCHER });
	}
}
