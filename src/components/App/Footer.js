import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { ACTIONS } from '../GlobalState/reducers/global';

import './Footer.css';

async function getGitHash(dispatch) {
	try {
		dispatch({ payload: { inProgress: true, type: 'gitHash'}, type: ACTIONS.SET_FETCHER });

		const res = await fetch('/git-version.txt').then(res => res.text());

		dispatch({ payload: { gitHash: res }, type: ACTIONS.SET_GITHASH });
	} catch(e) {
		console.error(e);
	} finally {
		dispatch({ payload: { inProgress: false, type: 'gitHash'}, type: ACTIONS.SET_FETCHER });
	}
}

export default function Footer() {
	const { dispatch, state: { fetcher: { gitHash: { inProgress: fetchingGitHash } }, meta: { gitHash }, showLoader } } = useContext(GlobalState);

	const shouldRender = !showLoader;

	useEffect(() => {
		if (shouldRender && !gitHash && fetchingGitHash !== false) {
			getGitHash(dispatch);
		}
	}, [dispatch, fetchingGitHash, gitHash, shouldRender]);

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
