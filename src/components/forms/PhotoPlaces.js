import { useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import GlobalState from '../GlobalState';

import { selectMultiselect, selectPhotos } from '../GlobalState/selectors';

const FIELDS = {
	PLACE_IDS: 'placeIds',
};

export default function PhotoPlaces() {
	const { handleSubmit, register } = useForm();
	const { state } = useContext(GlobalState);

	const { ids } = selectMultiselect(state);

	const { params: { photoId } } = useRouteMatch();
	console.log({ ids, photoId });

	const idsToUpdate = photoId ? [photoId] : ids.length ? ids : null;
	if (!idsToUpdate) {
		return <>Missing photoId</>
	}

	const onSubmit = (inputs) => {
		const photos = selectPhotos(state).filter((p) => idsToUpdate.includes(p.photoId.id));
		console.log({ photos });
		console.log({ idsToUpdate, inputs });
	};

	return (
		<div style={{ alignItems: 'center', display: 'flex', height: '100%', justifyContent: 'center', position: 'relative', width: '100%' }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input {...register(FIELDS.PLACE_IDS)} />
				<input type="submit" />
			</form>
		</div>
	);
};
