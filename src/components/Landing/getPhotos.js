import fetcher, { ACTIONS } from '../../utilities/fetcher';

export default async function getPhotos(setState) {
	try {
		setState((prev) => ({ ...prev, fetcher: { ...prev.fetcher, photos: { inProgress: true } }, showLoader: true }));

		let pageToken = null;
		const allPhotos = [];
		do {
			const res = await fetcher(ACTIONS.GET_PHOTOS, { pageToken }).then((res) => res.json());

			pageToken = res.nextPageToken;

			allPhotos.push(...res.photos);
		} while(pageToken);
		allPhotos.sort((a, b) => a.captureTime > b.captureTime ? -1 : a.captureTime < b.captureTime ? 1 : 0);

		const allPlaces = allPhotos.reduce((acc, cur) => {
			const { places } = cur;

			places?.forEach((place) => {
				const { placeId } = place;

				if (!acc[placeId]) {
					acc[placeId] = place;
				}
			});

			return acc;
		}, {});

		setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: allPhotos, places: allPlaces } }));
	} catch(e) {
		console.error(e);

		setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: [] } }));
	} finally {
		setState((prev) => ({ ...prev, fetcher: { ...prev.fetcher, photos: { inProgress: false } }, showLoader: false }));
	}
}
