import { ACTIONS } from '../GlobalState/reducers/global';
import { ACTIONS as FETCHER_ACTIONS } from '../../utilities';

import { fetcher } from '../../utilities';

export default async function getPhoto(dispatch, photoId) {
	const res = await fetcher(FETCHER_ACTIONS.GET_PHOTO, { photoId }).then((res) => res.json());

	dispatch({ payload: { updatedPhoto: res }, type: ACTIONS.UPDATE_PHOTO });
}
