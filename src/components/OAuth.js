import { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import GlobalState from './GlobalState';

import useCookies, { setCookie } from '../utilities/getCookies';
import { ACTIONS } from './GlobalState/reducers/global';

export default function OAuth() {
	const { dispatch, state: { isAuthed } } = useContext(GlobalState);

	const { access_token } = useCookies();
	const history = useHistory();
  const location = useLocation();

	useEffect(() => {
		if (!access_token) {
			let { hash } = location;
			hash = hash.replace('#', '');

			const sections = hash.split('&');
			const { access_token: newToken, expires_in } = sections.reduce((acc, section) => { const [key, val] = section.split('='); acc[key] = val; return acc; }, {});
			
			if (newToken) {
				const expires = new Date();
				expires.setSeconds(expires.getSeconds() + parseInt(expires_in));

				setCookie('access_token', newToken, expires.toUTCString());

				dispatch({ payload: { isAuthed: true }, type: ACTIONS.SET_ISAUTHED });
			}
		}

		history.push('/');
	}, [access_token, dispatch, history, isAuthed, location]);

	return null;
}
