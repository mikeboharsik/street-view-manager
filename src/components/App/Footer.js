import { useFeatureFlags } from '../../hooks';

import './Footer.css';

export default function Footer() {
	const { isEnabled } = useFeatureFlags();

	if (!isEnabled) {
		return null;
	}

	return (
		<div id="footer-container">
			<span><a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">GitHub</a></span>
			<span>Privacy Policy</span>
		</div>
	);
}
