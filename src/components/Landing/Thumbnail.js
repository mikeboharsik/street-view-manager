import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';

import ThumbnailOverlay from './ThumbnailOverlay';
import getThumbnailData from './getThumbnailData';

import './Thumbnail.css';

import ThumbnailPlaceholder from '../../images/thumbnail-placeholder.gif';
import { ACTIONS } from '../GlobalState/reducers/global';

import { selectMultiselect, selectThumbnails } from '../GlobalState/selectors/selectUploads';

const filters = Array(3).fill('drop-shadow(0px 0px 1px white)').join(' ');

export default function Thumbnail({ hide, photo }) {
	const { dispatch, state } = useContext(GlobalState);
	const { ids, isEnabled } = selectMultiselect(state);
	const thumbnails = selectThumbnails(state);

	const { photoId: { id: photoId }, thumbnailUrl } = photo;
	const photoIsSelected = ids.includes(photoId);
	const thumbnail = thumbnails[photoId];

	useEffect(() => {
		if (!thumbnail && thumbnailUrl) {
			getThumbnailData(dispatch, photoId, thumbnailUrl);
		}
	}, [dispatch, photoId, thumbnail, thumbnailUrl]);

	const imgSrc = thumbnail ? thumbnail : ThumbnailPlaceholder;

	let image;
	if (isEnabled) {
		const style = photoIsSelected ? { filter: filters } : {};
		image = (
			<div style={{ display: 'flex' }} onClick={() => dispatch({ payload: { photoId }, type: ACTIONS.TOGGLE_MULTISELECT_ID })}>
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
