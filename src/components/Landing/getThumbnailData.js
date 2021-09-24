export default async function getThumbnailData(setState, photoId, thumbnailUrl) {
	let success = false;
	let attempts = 0;
	while (!success && attempts < 3) {
		try {
			const res = await fetch(thumbnailUrl);

			if (res.ok) {
				const blob = await res.blob();
				const bitsLocation = URL.createObjectURL(blob);

				setState((prev) => ({ ...prev, uploads: { ...prev.uploads, thumbnails: { ...prev.uploads.thumbnails, [photoId]: bitsLocation } } }));

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
