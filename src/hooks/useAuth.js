import { useEffect } from 'react';
import { useHistory } from 'react-router';

import checkAccessToken from '../utilities/checkAccessToken';

import { ACTIONS } from '../components/GlobalState/reducers/global';

export default function useAuth(dispatch, state) {
	const history = useHistory();
	const { location: { pathname } } = history;

	useEffect(() => {
		if (state.isAuthed === null) {
			const haveAccessToken = checkAccessToken();
	
			dispatch({ payload: { isAuthed: haveAccessToken }, type: ACTIONS.SET_ISAUTHED });

			if (haveAccessToken) {
				localStorage.setItem('userIsLoggedIn', true);
			}
		}
	}, [dispatch, history, pathname, state.isAuthed]);
}
