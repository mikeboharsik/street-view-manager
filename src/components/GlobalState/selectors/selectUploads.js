export function selectMultiselect(state) {
	return state?.uploads?.multiselect;
}

export function selectPhotos(state) {
	return state?.uploads?.photos;
}

export function selectThumbnails(state) {
	return state?.uploads?.thumbnails;
}

export default function selectUploads(state) {
	return state?.uploads;
}
