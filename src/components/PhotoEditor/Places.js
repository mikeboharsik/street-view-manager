import { useContext } from 'react';
import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { selectPlaces } from '../GlobalState/selectors/selectUploads';

export default function Places({ curPhoto }) {
	const state = useContext(GlobalState);
	const places = selectPlaces(state);

	const { places: photoPlaces } = curPhoto;

	async function placeIdOnClickHander(e) {
		const placeId = e.target.getAttribute('placeid');
		await navigator.clipboard.writeText(placeId);
		toast('Copied Place ID!', { autoClose: 2500, type: 'success' });
	}

	return (
		<span>
			Places: {
				(photoPlaces?.length && photoPlaces.map((p) =>
					<span
						style={{ cursor: 'pointer' }}
						key={p.placeId}
						placeid={p.placeId}
						onClick={placeIdOnClickHander}
					>
						{places?.[p.placeId]?.name || p.name || p.placeId}
						&nbsp;&nbsp;
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
