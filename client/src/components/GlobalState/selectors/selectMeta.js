export function selectGitHash(state) {
	return selectMeta(state)?.gitHash;
}

export default function selectMeta(state) {
	return state?.meta;
}
