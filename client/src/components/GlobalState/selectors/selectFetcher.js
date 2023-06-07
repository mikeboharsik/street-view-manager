export default function selectFetcher(state, type) {
	return state?.fetcher?.[type];
}
