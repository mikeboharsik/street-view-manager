import { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import GlobalState from './GlobalState';

import useCookies, { setCookie } from '../hooks/useCookies';

export default function OAuth() {
	console.log('test');

	const { isAuthed, setState } = useContext(GlobalState);

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

				setState((prev) => ({ ...prev, isAuthed: true }));
			}
		}

		history.push('/');
	}, [access_token, history, isAuthed, location, setState]);

	return null;
}
