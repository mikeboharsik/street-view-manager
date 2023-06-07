import { useContext } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { selectPlaces } from '../GlobalState/selectors/selectUploads';

function getDisplayTextFromPlaceId(places, photoPlace) {
	return places?.[photoPlace.placeId]?.name || photoPlace.name || photoPlace.placeId
}

export default function Places({ curPhoto }) {
	const { state } = useContext(GlobalState);
	const places = selectPlaces(state);

	const { places: photoPlaces } = curPhoto;

	async function placeIdOnClickHander(e) {
		const { ctrlKey } = e;
		if (ctrlKey) {
			await navigator.clipboard.writeText(photoPlaces?.map((p) => p.placeId).join(','));	
			toast('Copied all Place IDs!', { autoClose: 2500, type: 'success' });

			return;
		}

		const placeId = e.target.getAttribute('placeid');
		await navigator.clipboard.writeText(placeId);
		toast(`Copied Place ID for ${getDisplayTextFromPlaceId(places, { placeId })}!`, { autoClose: 2500, type: 'success' });
	}

	return (
		<span>
			Places: {
				(photoPlaces?.length && photoPlaces.map((p) =>
					<span
						key={p.placeId}
						onClick={placeIdOnClickHander}
						placeid={p.placeId}
						style={{ cursor: 'pointer' }}
						title={p.placeId}
					>
						{`[${getDisplayTextFromPlaceId(places, p)}]`}
						&nbsp;
					</span>
				)) || 'None '
			}
			<a target="_blank" rel="noreferrer" href="https://developers.google.com/maps/documentation/places/web-service/place-id">
				(?)
			</a>
			<input style={{ opacity: 0, position: 'absolute' }} type="text" id="copy" />
		</span>
	);
}
