import { ACTIONS } from '../GlobalState/reducers/global';

export default async function getThumbnailData(dispatch, photoId, thumbnailUrl) {
	let success = false;
	let attempts = 0;
	while (!success && attempts < 3) {
		try {
			const res = await fetch(thumbnailUrl);

			if (res.ok) {
				const blob = await res.blob();
				const dataUrl = URL.createObjectURL(blob);

				dispatch({ payload: { dataUrl, photoId }, type: ACTIONS.SET_THUMBNAIL_DATA })

				success = true;
			}
		} catch(e) {
			console.error(e);
		} finally {
			attempts++;
		}
	}

	if (!success) {
		console.log(`Failed to load thumbnail data for photo ID ${photoId} (${thumbnailUrl})`);
	}
};
