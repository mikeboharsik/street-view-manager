import GitHashLink from './GitHashLink';

import './Footer.css';

import LogoutButton from './LogoutButton';

export default function Footer() {
	return (
		<div id="footer-container">
			<div id="footer-links-container">
				<LogoutButton />
				<span>
					<a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">
						GitHub
					</a>
				</span>
				<GitHashLink />
			</div>

			<div id="footer-disclaimer-container">
				<span>This third-party application is not associated in any way with Google</span>
			</div>
		</div>
	);
}
