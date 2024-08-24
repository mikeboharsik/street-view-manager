import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getCookie, setCookie } from '../../utilities/getCookies';

import GitHashLink from './GitHashLink';

import './Footer.css';

import LogoutButton from './LogoutButton';

const cookieName = 'userDismissedBetaNotice';

function toastOnClose() {
	const expires = new Date();

	expires.setMonth(expires.getMonth() + 1);

	setCookie(cookieName, true, expires);
}

export default function Footer() {
	const userDismissedBetaNotice = getCookie(cookieName) === 'true';

	const [userWasWarned, setUserWasWarned] = useState(userDismissedBetaNotice);

	useEffect(() => {
		if (!userWasWarned) {
			toast(
				'This software is in development. Please excuse any bugs or missing features.',
				{ autoClose: false, onClose: toastOnClose, type: 'info' },
			);
			setUserWasWarned(true);
		}
	}, [setUserWasWarned, userWasWarned]);

	if (window.location.pathname === '/oauth') {
		return null;
	}

	return (
		<div id="footer-container" data-testid="footer-container">
			<div id="footer-links-container">
				<GitHashLink />
				<span>
					<a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">
						GitHub
					</a>
				</span>
				<LogoutButton />
			</div>

			<div id="footer-disclaimer-container">
				<span>This third-party application is not associated in any way with Google</span>
			</div>
		</div>
	);
}
