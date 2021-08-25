import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import useCookies, { setCookie } from '../hooks/useCookies';

export default function OAuth() {
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
			}
		}

		history.push('/');
	}, [access_token, history, location]);

	return null;
}
