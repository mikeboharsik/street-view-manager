export default function stringToPlaceId(state, str) {
	const { uploads: { places: knownPlaces } } = state;

	let place = knownPlaces[str];
	if (place) return place;

	const placeKeys = Object.keys(knownPlaces);
	place = placeKeys.find((key) => knownPlaces[key].name === str);

	return place ?? str;
}
