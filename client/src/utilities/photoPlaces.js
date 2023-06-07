export default function stringToPlaceId(state, str) {
	const { uploads: { places: knownPlaces } } = state;

	const place = knownPlaces[str];
	if (place) return place.placeId;

	const placeKeys = Object.keys(knownPlaces);
	const placeId = placeKeys.find((key) => knownPlaces[key].name === str);

	return placeId ?? str;
}
