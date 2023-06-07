import { toast } from 'react-toastify';

import useGitHash from './useGitHash';

export default function GitHashLink() {
	const gitHash = useGitHash();
	const visibilityClass = gitHash ? 'visible' : 'invisible';

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
		<span
			className={visibilityClass}
			id="footer-githash-link"
			onClick={onClickHandler}
			title={gitHash}
		>
			ⓘ
		</span>
	);
}
