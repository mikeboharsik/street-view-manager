import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { ACTIONS } from '../GlobalState/reducers/global';

import { selectFetcher, selectMeta } from '../GlobalState/selectors';

export default function useGitHash() {
	const { dispatch, state } = useContext(GlobalState);

	const { inProgress: fetchingGitHash } = selectFetcher(state, 'gitHash');
	const { gitHash } = selectMeta(state);

	useEffect(() => {
		if (!gitHash && fetchingGitHash === null) {
			(async () => {
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
			})();
		}
	}, [dispatch, fetchingGitHash, gitHash]);

	return gitHash;
}
