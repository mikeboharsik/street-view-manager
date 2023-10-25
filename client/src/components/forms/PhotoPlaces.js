import { useContext, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';

import GlobalState from '../GlobalState';

import { selectMultiselect, selectPhotos } from '../GlobalState/selectors';
import { ACTIONS } from '../GlobalState/reducers/global';
import { fetcher, ACTIONS as FETCHER_ACTIONS, stringToPlaceId } from '../../utilities';

import './PhotoPlaces.css';

const FIELDS = {
	PLACE_IDS: 'placeIds',
};

export default function PhotoPlaces() {
	const { handleSubmit, register, unregister } = useForm();
	const { dispatch, state } = useContext(GlobalState);

	const { ids } = selectMultiselect(state);
	const { params: { photoId } } = useRouteMatch();
	const idsToUpdate = photoId ? [photoId] : ids.length ? ids : null;

	const selectedPhotos = selectPhotos(state).filter((p) => idsToUpdate.includes(p.photoId.id));
	const commonPlaces = selectedPhotos.reduce((acc, cur) => {
		cur.places?.forEach(place => {
			const { placeId } = place;
			if (!acc.find(e => e.placeId === placeId)) {
				acc.push(place);
			}
		});
		return acc;
	}, []);
	
	const [inputCount, setInputCount] = useState(commonPlaces.length);

	if (!idsToUpdate) {
		return <>Missing photoId</>
	}

	const onSubmit = async (inputs) => {
		const allPlaces = Object.keys(inputs).map((inputName) => ({ placeId: stringToPlaceId(state, inputs[inputName])}));

		const updateMask = 'places';
		const body = {
			updatePhotoRequests: selectedPhotos.map((photo) => ({
				photo: {
					photoId: photo.photoId,
					places: allPlaces,
				},
				updateMask,
			}))
		};

		try {
			const result = await fetcher(FETCHER_ACTIONS.UPDATE_PHOTOS, { body });
			if (!result.ok) {
				const { error: { message } } = await result.json();
				throw new Error(message);
			}

			dispatch({ payload: { form: null }, type: ACTIONS.SET_MODAL });

			toast('Success! Bear in mind that it may take a minute or two for the photo cache to update');
		} catch (e) {
			toast(`Failed to update photos: ${e.message}`, { type: 'error' });
			console.error(e);
		}
	};

	return (
		<div id="photoPlacesFormContainer">
			<div style={{ padding: '1em', backgroundColor: 'rgba(0.2, 0.2, 0.2, 1.0)', fontWeight: 'bold', position: 'absolute', top: '1em' }}>Update Photo Places</div>

			<form id="photoPlacesForm" onSubmit={handleSubmit(onSubmit)}>
				{new Array(inputCount).fill().map((e, i) => {
					const commonPlace = commonPlaces[i];

					const inputName = `${FIELDS.PLACE_IDS}_${i}`;

					return (
						<div key={inputName} className="inputRow">
							<input id={inputName} defaultValue={commonPlace?.name} {...register(inputName)} />
							<span style={{ cursor: 'pointer', display: inputCount > 1 ? 'inline' : 'none', paddingLeft: '0.5em' }} onClick={() => {
								if (inputCount > 0) {
									setInputCount(cur => cur - 1);
									unregister(inputName);
								}
							}}>
								{inputCount > 1 ? '-' : ''}
							</span>
						</div>
					)
				})}
				<span style={{ alignSelf: 'center', cursor: 'pointer', margin: '1em 0em' }} onClick={() => setInputCount(cur => cur + 1)}>
					+
				</span>
				<input type="submit" />
			</form>
		</div>
	);
};
