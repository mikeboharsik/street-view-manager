import { useIsAuthed } from '../../hooks';
import { Logout as LogoutIcon } from '../icons';

import { setCookie } from '../../utilities/getCookies';

function clickHandler() {
	setCookie('access_token', '', new Date(1970, 1, 1));
	localStorage.removeItem('userIsLoggedIn');
	window.location.reload();
}

export default function LogoutButton() {
	const isAuthed = useIsAuthed();

	if (isAuthed) {
		return (
			<span
				data-cy="logout-button"
				onClick={clickHandler}
				style={{ cursor: 'pointer', left: 0, position: 'absolute' }}
				title="Log Out"
			>
				<LogoutIcon />
			</span>
		);
	}

	return null;
}
