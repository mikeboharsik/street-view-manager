import fetcher, { ACTIONS as FETCHER_ACTIONS } from '../../utilities/fetcher';
import { ACTIONS } from '../GlobalState/reducers/global';

export default async function getPhotos(dispatch) {
	try {
		dispatch({ payload: { inProgress: true, type: 'photos' }, type: ACTIONS.SET_FETCHER });
		dispatch({ payload: { showLoader: true }, type: ACTIONS.SET_SHOWLOADER });

		let pageToken = null;
		do {
			const res = await fetcher(FETCHER_ACTIONS.GET_PHOTOS, { pageToken }).then((res) => res.json());

			pageToken = res.nextPageToken;

			dispatch({ payload: { photos: res.photos ?? [] }, type: ACTIONS.ADD_PHOTOS });
		} while(pageToken);
	} catch(e) {
		console.error(e);
	} finally {
		dispatch({ payload: { inProgress: false, type: 'photos' }, type: ACTIONS.SET_FETCHER });
		dispatch({ payload: { reverse: true, sortProp: 'captureTime' }, type: ACTIONS.SORT_PHOTOS });
		dispatch({ payload: { showLoader: false }, type: ACTIONS.SET_SHOWLOADER });
	}
}
