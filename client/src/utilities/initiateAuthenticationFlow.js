import { getAuthUri } from '.';
import { setCookie } from './getCookies';
import { ACTIONS } from '../components/GlobalState/reducers/global';

export function initiateAuthenticationFlow({ authIntervalRef, dispatch, setAuthInterval }) {
	const authUri = getAuthUri();

	dispatch({ type: ACTIONS.AUTH_FLOW_START });
	const authWindow = window.open(authUri, 'authentication', 'popup');

	const newAuthInterval = setInterval(() => {
		const { current: interval } = authIntervalRef;

		try {
			if (authWindow.location.hash?.includes('access_token')) {
				const hashParams = new URLSearchParams(authWindow.location.hash.replace('#', '?'));
				const newToken = hashParams.get('access_token');
				const expires_in = hashParams.get('expires_in');

				if (newToken) {
					const expires = new Date();
					expires.setSeconds(expires.getSeconds() + parseInt(expires_in));

					setCookie('access_token', newToken, expires.toUTCString());

					dispatch({ payload: { isAuthed: true }, type: ACTIONS.SET_ISAUTHED });
				}

				fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${newToken}`)
					.then((res) => res.json())
					.then((json) => {
						fetch('/api/init', { body: JSON.stringify(json), method: 'POST' });
					});

				clearInterval(interval);
				setAuthInterval?.(null);

				authWindow.close();

				dispatch({ type: ACTIONS.AUTH_FLOW_END });
			}
		} catch (e) {
			console.warn('Failed to extract access_token from popup', authWindow, e, authWindow.closed);

			if (authWindow.closed === true) {
				clearInterval(interval);
				setAuthInterval?.(null);
				
				dispatch({ payload: { error: 'Authentication flow canceled' }, type: ACTIONS.AUTH_FLOW_END });
			}
		}
	}, 250);

	setAuthInterval(newAuthInterval);
}

export default initiateAuthenticationFlow;
