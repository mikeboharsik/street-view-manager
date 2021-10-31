import { toast } from 'react-toastify';

import useGitHash from './useGitHash';

export default function GitHashLink() {
	const gitHash = useGitHash();
	if (!gitHash) {
		return null;
	}

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
			onClick={onClickHandler}
			style={{ cursor: 'pointer', position: 'absolute', right: 0 }}
			title={gitHash}
		>
			ⓘ
		</span>
	);
}
