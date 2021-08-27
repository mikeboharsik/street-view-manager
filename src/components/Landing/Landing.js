import { useContext, useEffect, useState } from 'react';
import GlobalState from '../GlobalState';
import fetcher, { ACTIONS } from '../../utilities/fetcher';
import { Chain as ChainIcon, Eye as EyeIcon } from '../icons';

import checkAccessToken from '../../utilities/checkAccessToken';

import { Link } from 'react-router-dom';

import './Landing.css';

function ThumbnailOverlay({ photo }) {
	const { uploads: { places } } = useContext(GlobalState);

	const { captureTime, connections, places: photoPlaces, viewCount } = photo;

	if (viewCount === undefined) {
		return null;
	}

	const placeNames = photoPlaces?.map(p => places[p?.placeId]?.name || p?.name || p?.placeId).join(', ') ?? 'No places';
	const captureTimeDate = new Date(captureTime).toLocaleString();

	return (
		<div className="thumbnail-overlay-container">
			<div className="thumbnail-overlay-item thumbnail-overlay-connections">
				<ChainIcon style={{ filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)', height: 16, width: 16 }} />
				&nbsp;
				{connections?.length ?? 0}
			</div>
			<div className="thumbnail-overlay-item thumbnail-overlay-capturetime">
				{captureTimeDate}
			</div>
			<div className="thumbnail-overlay-item thumbnail-overlay-viewcount">
				<EyeIcon style={{ filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)', height: 16, width: 16 }} />
				&nbsp;
				{viewCount}
			</div>
			<div className="thumbnail-overlay-item thumbnail-overlay-placenames" title={placeNames}>	
				{placeNames}
			</div>
		</div>
	);
}

function Thumbnail({ hide, photo }) {
	const { photoId: { id: photoId }, thumbnailUrl: url } = photo;

	return (
		<div className={`thumbnail-container${hide ? ' invisible' : ''}`}>
			<Link to={`/photoEditor/${photoId}`}>
				<img className="thumbnail-image" alt="" src={url} />
			</Link>
			<ThumbnailOverlay photo={photo} />
		</div>
	);
}

function Thumbnails({ photos }) {
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

function PhotosNav() {
	const { fetcher: { photos: { inProgress } }, setState, uploads: { currentPage, photos, photosPerPage } } = useContext(GlobalState);

	if (inProgress || photos.length <= 0) {
		return null;
	}

	const pageCount = Math.ceil(photos.length / photosPerPage);
	const hideLeft = currentPage === 0;
	const hideLeftLeft = hideLeft || currentPage === 1;
	const hideRight = currentPage + 1 === pageCount;
	const hideRightRight = hideRight || currentPage + 1 === pageCount - 1;

	const currentPageNav = currentPage + 1 < 10 ? `0${currentPage + 1}` : currentPage + 1;
	const pageCountNav = pageCount < 10 ? `0${pageCount}` : pageCount;
	const pageIndicator = `${currentPageNav} / ${pageCountNav}`;

	return (
		<div id="photos-nav-container">
			<span
				style={{ cursor: hideLeftLeft ? 'default' : 'pointer', opacity: hideLeftLeft ? 0 : 1 }}
				onClick={() => { if (hideLeftLeft) return; setState((prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: 0 }})); }}
			>
				{'<<'}
			</span>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span
				style={{ cursor: hideLeft ? 'default' : 'pointer', opacity: hideLeft ? 0 : 1 }}
				onClick={() => { if (hideLeft) return; setState((prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: currentPage - 1 }})); }}
			>
				{'<'}
			</span>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span>{pageIndicator}</span>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span
				style={{ cursor: hideRight ? 'default' : 'pointer', opacity: hideRight ? 0 : 1 }}
				onClick={() => { if (hideRight) return; setState((prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: currentPage + 1 }})); }}
			>
				{'>'}
			</span>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span
				style={{ cursor: hideRightRight ? 'default' : 'pointer', opacity: hideRightRight ? 0 : 1 }}
				onClick={() => { if (hideRightRight) return; setState((prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: pageCount - 1 }})); }}
			>
				{'>>'}
			</span>
		</div>
	);
}

export default function Config() {
	checkAccessToken();

	const { fetcher: { photos: { inProgress } }, setState, uploads: { photos } } = useContext(GlobalState);

	useEffect(() => {
		if (inProgress === null) {
			async function getPhotos() {
				try {
					setState((prev) => ({ ...prev, fetcher: { ...prev.fetcher, photos: { inProgress: true } }, showLoader: true }));

					let pageToken = null;
					const allPhotos = [];
					do {
						const res = await fetcher(ACTIONS.GET_PHOTOS, { pageToken }).then((res) => res.json());

						pageToken = res.nextPageToken;

						allPhotos.push(...res.photos);
					} while(pageToken);
					allPhotos.sort((a, b) => a.captureTime > b.captureTime ? -1 : a.captureTime < b.captureTime ? 1 : 0);

					const allPlaces = allPhotos.reduce((acc, cur) => {
						const { places } = cur;

						places?.forEach((place) => {
							const { placeId } = place;

							if (!acc[placeId]) {
								acc[placeId] = place;
							}
						});

						return acc;
					}, {});

					setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: allPhotos, places: allPlaces } }));
				} catch(e) {
					console.error(e);

					setState((prev) => ({ ...prev, uploads: { ...prev.uploads, photos: [] } }));
				} finally {
					setState((prev) => ({ ...prev, fetcher: { ...prev.fetcher, photos: { inProgress: false } }, showLoader: false }));
				}
			}
			getPhotos();

			return;
		}
	}, [inProgress, photos, setState]);

	if (!photos) {
		return null;
	}

	return (
		<>
			<div className="header">
				Photos
			</div>

			<Thumbnails photos={photos} />

			<PhotosNav />
		</>
	);
}
