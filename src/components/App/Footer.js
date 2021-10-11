import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { selectFetcher, selectMeta } from '../GlobalState/selectors';
import getGitHash from './getGitHash';

import './Footer.css';

export default function Footer() {
	const { dispatch, state } = useContext(GlobalState);

	const { inProgress: fetchingGitHash } = selectFetcher(state, 'gitHash');
	const { gitHash } = selectMeta(state);

	useEffect(() => {
		if (!gitHash && fetchingGitHash !== false) {
			getGitHash(dispatch);
		}
	}, [dispatch, fetchingGitHash, gitHash]);

	async function onClickHandler(e) {
		if (gitHash) {
			const { ctrlKey } = e;

			if (ctrlKey) {
				await navigator.clipboard.writeText(gitHash);
				toast('Copied git hash!');
			} else {
				window.open(`https://github.com/mikeboharsik/street-view-manager/commit/${gitHash}`);
			}
		}
	}

	return (
		<div id="footer-container">
			<div id="footer-links-container">
				<span><a href="https://github.com/mikeboharsik/street-view-manager" rel="noreferrer" target="_blank">GitHub</a></span>
				<span
					onClick={onClickHandler}
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
