import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

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

	const shouldRender = !showLoader;

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
			<div id="footer-links-container">
				<span><a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">GitHub</a></span>
				<span
					onClick={async (e) => {
						const { ctrlKey } = e;

						if (ctrlKey) {
							await navigator.clipboard.writeText(gitHash);
							toast('Copied git hash!');
						} else {
							window.open(`https://github.com/mikeboharsik/street-view-manager/commit/${gitHash}`);
						}
					}}
					style={{ cursor: 'pointer', position: 'absolute', right: 0 }}
					title={gitHash}
				>
					ⓘ
				</span>
			</div>

			<div id="footer-disclaimer-container">
				<span>This third-party application is not associated in any way with Google</span>
			</div>
		</div>
	);
}
