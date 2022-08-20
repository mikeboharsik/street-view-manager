import { getAuthUri } from '.';
import { setCookie } from './getCookies';
import { ACTIONS } from '../components/GlobalState/reducers/global';

export function initiateAuthenticationFlow({ authIntervalRef, dispatch, setAuthInterval }) {
	const authUri = getAuthUri();

	const authWindow = window.open(authUri, 'authentication', 'popup');

	const newAuthInterval = setInterval(() => {
		const { current: interval } = authIntervalRef;

		if (authWindow.location.hash?.includes('access_token')) {
			const hashParams = new URLSearchParams(authWindow.location.hash.replace('#', '?'));
			const newToken = hashParams.get('access_token');
			const expires_in = hashParams.get('expires_in');

			if (newToken) {
				const expires = new Date();
				expires.setSeconds(expires.getSeconds() + parseInt(expires_in));

				setCookie('access_token', newToken, expires.toUTCString());

				dispatch?.({ payload: { isAuthed: true }, type: ACTIONS.SET_ISAUTHED });
			}

			clearInterval(interval);
			setAuthInterval?.(null);

			authWindow.close();
		}
	}, 250);

	setAuthInterval(newAuthInterval);
}

export default initiateAuthenticationFlow;
