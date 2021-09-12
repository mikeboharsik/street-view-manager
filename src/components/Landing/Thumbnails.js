import { useContext, useEffect, useState } from 'react';

import GlobalState from '../GlobalState';

import Thumbnail from './Thumbnail';

import './Thumbnails.css';

export default function Thumbnails({ photos }) {
	const { fetcher: { photos: { inProgress } }, uploads: { currentPage, photosPerPage } } = useContext(GlobalState);

	const [renderedPhotos, setRenderedPhotos] = useState(null);

	useEffect(() => {
		if (photos) {
			const start = currentPage * photosPerPage;

			setRenderedPhotos(photos.slice(start, start + photosPerPage));
		}
	}, [currentPage, photos, photosPerPage]);

	if (photos.length <= 0 && inProgress === false) {
		return (
			<div>
				No photos. Go ahead and upload some.
			</div>
		);
	}

	if (renderedPhotos && inProgress === false) {
		const thumbnails = renderedPhotos.map((photo) => <Thumbnail key={photo.photoId.id} photo={photo} />);

		if (thumbnails.length % photosPerPage !== 0) {
			const extraCount = photosPerPage - thumbnails.length;

			for (let i = 0; i < extraCount; i++) {
				thumbnails.push(<Thumbnail key={i} hide photo={{ photoId: { id: '' }, thumbnailUrl: renderedPhotos[renderedPhotos.length - 1].thumbnailUrl }} />);
			}
		}

		return <div id="thumbnails-container">{thumbnails}</div>;
	}

	return null;
}
