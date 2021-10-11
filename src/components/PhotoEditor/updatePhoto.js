import { ACTIONS } from "../GlobalState/reducers/global";
import { ACTIONS as FETCHER_ACTIONS } from "../../utilities";

import { fetcher } from "../../utilities";

export default async function updatePhoto(dispatch, options) {
	const res = await fetcher(FETCHER_ACTIONS.UPDATE_PHOTO, options);
	if (!res.ok) {
		console.error(await res.json());
		throw res.status;
	}

	dispatch({ payload: { updatedPhoto: options.body }, type: ACTIONS.UPDATE_PHOTO })
}
