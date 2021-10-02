import { useContext, useEffect } from 'react';

import checkAccessToken from '../../utilities/checkAccessToken';
import GlobalState from '../GlobalState';

import { ACTIONS } from '../GlobalState/reducers/global';

export default function Auth() {
	const { dispatch, state } = useContext(GlobalState);

	useEffect(() => {
		if (!state.isAuthed) {
			const haveAccessToken = checkAccessToken();
			if (!haveAccessToken) {
				return null;
			}
	
			dispatch({ payload: { isAuthed: true }, type: ACTIONS.SET_ISAUTHED });
		}
	}, [dispatch, state.isAuthed]);

	return null;
}
