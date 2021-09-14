import { useContext } from 'react';
import GlobalState from '../GlobalState';
import { FEATURE_FLAGS, useFeatureFlags } from '../../hooks';

import './Footer.css';

export default function Footer() {
	const { showLoader } = useContext(GlobalState);
	const { isEnabled } = useFeatureFlags();

	if (!isEnabled(FEATURE_FLAGS.FOOTER) || showLoader) {
		return null;
	}

	return (
		<div id="footer-container">
			<span><a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">GitHub</a></span>
			<span>Privacy Policy</span>
		</div>
	);
}
