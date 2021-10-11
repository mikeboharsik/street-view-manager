export function selectMultiselect(state) {
	return state?.uploads?.multiselect;
}

export function selectPhotos(state) {
	return state?.uploads?.photos;
}

export function selectPlaces(state) {
	return state?.uploads?.places;
}

export function selectThumbnails(state) {
	return state?.uploads?.thumbnails;
}

export default function selectUploads(state) {
	return state?.uploads;
}
