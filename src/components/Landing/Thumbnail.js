import { useContext } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';

import ThumbnailOverlay from './ThumbnailOverlay';

import './Thumbnail.css';

export default function Thumbnail({ hide, photo }) {
	const { uploads: { multiselect: { ids, isEnabled } }, setState } = useContext(GlobalState);

	const { photoId: { id: photoId }, thumbnailUrl: url } = photo;

	const photoIsSelected = ids.includes(photoId);

	const baseFilter = 'drop-shadow(0px 0px 1px white)';
	const filters = Array(3).fill(baseFilter).join(' ');

	let image = null;
	if (isEnabled) {
		const style = photoIsSelected ? { filter: filters } : {};
		image = (
			<div style={{ display: 'flex' }} onClick={() => setState((prev) => {
				let newIds = prev.uploads.multiselect.ids;
				const curIndex = newIds.indexOf(photoId);
				if (curIndex === -1) {
					newIds = [...newIds, photoId];
				} else {
					newIds = newIds.filter((id) => id !== photoId);
				}

				return {
					...prev,
					uploads: {
						...prev.uploads,
						multiselect: {
							...prev.uploads.multiselect,
							ids: newIds,
						},
					},
				};
			})}>
				<img className="thumbnail-image" style={{ ...style, cursor: 'cell' }} alt="" src={url} />
			</div>
		);
	} else {
		image = (
			<Link to={`/photoEditor/${photoId}`}>
				<img className="thumbnail-image" alt="" src={url} />
			</Link>
		);
	}

	return (
		<div className={`thumbnail-container${hide ? ' invisible' : ''}`}>
			{image}
			<ThumbnailOverlay photo={photo} />
		</div>
	);
}
