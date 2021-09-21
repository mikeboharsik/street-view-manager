import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';
import { FEATURE_FLAGS, useFeatureFlags } from '../../hooks';

import './Footer.css';

async function getGitHash(setState) {
	try {
		setState((prev) => ({ ...prev, fetcher: { ...prev.fetcher, gitHash: { ...prev.fetcher.gitHash, inProgress: true }}}));

		const res = await fetch('/git-version.txt').then(res => res.text());

		setState((prev) => ({ ...prev, meta: { ...prev.meta, gitHash: res }}));
	} catch(e) {
		console.error(e);
	} finally {
		setState((prev) => ({ ...prev, fetcher: { ...prev.fetcher, gitHash: { ...prev.fetcher.gitHash, inProgress: false }}}));
	}
}

export default function Footer() {
	const { fetcher: { gitHash: { inProgress: fetchingGitHash } }, meta: { gitHash }, setState, showLoader } = useContext(GlobalState);

	const { isEnabled } = useFeatureFlags();

	const shouldRender = isEnabled(FEATURE_FLAGS.FOOTER) && !showLoader;

	useEffect(() => {
		if (shouldRender && !gitHash && fetchingGitHash !== false) {
			getGitHash(setState);
		}
	}, [fetchingGitHash, gitHash, setState, shouldRender]);

	if (!shouldRender) {
		return null;
	}

	return (
		<div id="footer-container">
			<span><a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">GitHub</a></span>
			<span
				onClick={async () => {
					await navigator.clipboard.writeText(gitHash);
					toast('Copied git hash!');
				}}
				style={{ cursor: 'default' }}
				title={gitHash}>ⓘ</span>
		</div>
	);
}
