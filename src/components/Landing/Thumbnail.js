import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';

import ThumbnailOverlay from './ThumbnailOverlay';
import getThumbnailData from './getThumbnailData';

import './Thumbnail.css';

import ThumbnailPlaceholder from '../../images/thumbnail-placeholder.gif';

function getThumbnailClickHandler(setState, photoId) {
	return function handleThumbnailClick() {
		setState((prev) => {
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
		});
	}
}

export default function Thumbnail({ hide, photo }) {
	const { uploads: { multiselect: { ids, isEnabled }, thumbnails }, setState } = useContext(GlobalState);

	const { photoId: { id: photoId }, thumbnailUrl } = photo;

	const thumbnail = thumbnails[photoId];

	useEffect(() => {
		if (!thumbnail) {
			getThumbnailData(setState, photoId, thumbnailUrl);
		}
	}, [photoId, setState, thumbnail, thumbnailUrl]);

	const photoIsSelected = ids.includes(photoId);

	const baseFilter = 'drop-shadow(0px 0px 1px white)';
	const filters = Array(3).fill(baseFilter).join(' ');

	const imgSrc = thumbnail ? thumbnail : ThumbnailPlaceholder;

	let image = null;
	if (isEnabled) {
		const style = photoIsSelected ? { filter: filters } : {};
		image = (
			<div style={{ display: 'flex' }} onClick={getThumbnailClickHandler(setState, photoId)}>
				<img className="thumbnail-image" style={{ ...style, cursor: 'cell' }} alt="" src={imgSrc} />
			</div>
		);
	} else {
		image = (
			<Link to={`/photoEditor/${photoId}`}>
				<img className="thumbnail-image" alt="" src={imgSrc} />
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
