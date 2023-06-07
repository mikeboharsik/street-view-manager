export function selectMultiselect(state) {
	return selectUploads(state)?.multiselect;
}

export function selectPhoto(state, photoId) {
	return selectPhotos(state)?.photos?.find((p) => p.photoId.id === photoId);
}

export function selectPhotos(state) {
	return selectUploads(state)?.photos;
}

export function selectPhotoPlaces(state, photoId) {
	return selectPhoto(state, photoId)?.places;
}

export function selectPlaces(state) {
	return selectUploads(state)?.places;
}

export function selectThumbnails(state) {
	return selectUploads(state)?.thumbnails;
}

export default function selectUploads(state) {
	return state?.uploads;
}
