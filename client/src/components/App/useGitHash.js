import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { ACTIONS } from '../GlobalState/reducers/global';

import { selectFetcher, selectMeta } from '../GlobalState/selectors';

import { FEATURE_FLAGS, getFeatureFlag } from '../../utilities';

export default function useGitHash() {
	const { dispatch, state } = useContext(GlobalState);

	const { inProgress: fetchingGitHash } = selectFetcher(state, 'gitHash');
	const { gitHash } = selectMeta(state);

	useEffect(() => {
		if (!gitHash && fetchingGitHash === null) {
			(async () => {
				try {
					dispatch({ payload: { inProgress: true, type: 'gitHash'}, type: ACTIONS.SET_FETCHER });
			
					const res = await fetch('/static/version.json').then(res => res.json());
			
					dispatch({ payload: { gitHash: res.client }, type: ACTIONS.SET_GITHASH });
				} catch(e) {
					console.error(e);
			
					const ff = getFeatureFlag(FEATURE_FLAGS.HIDE_HASH_ERROR);
					if (!ff) {
						toast(`Failed to load git hash: ${e.message}`, { type: 'error' });
					}
				} finally {
					dispatch({ payload: { inProgress: false, type: 'gitHash' }, type: ACTIONS.SET_FETCHER });
				}
			})();
		}
	}, [dispatch, fetchingGitHash, gitHash]);

	return gitHash;
}
