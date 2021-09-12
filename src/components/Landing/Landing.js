import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import GlobalState from '../GlobalState';
import fetcher, { ACTIONS } from '../../utilities/fetcher';
import { Chain as ChainIcon, Eye as EyeIcon } from '../icons';
import useFeatureFlags, { FEATURE_FLAGS } from '../../hooks/useFeatureFlags';

import './Landing.css';

function Thumbnails({ photos }) {
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
				<div className="thumbnail-overlay-item thumbnail-overlay-connections" title="Connections">
					<ChainIcon style={{ filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)', height: 16, width: 16 }} />
					&nbsp;
					{connections?.length ?? 0}
				</div>
				<div className="thumbnail-overlay-item thumbnail-overlay-capturetime" title="Capture Time">
					{captureTimeDate}
				</div>
				<div className="thumbnail-overlay-item thumbnail-overlay-viewcount" title="Views">
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
	function NavButton({ char, isHidden, setStateHandler }) {
		const cursor = isHidden ? 'default' : 'pointer';
		const opacity = isHidden ? 0 : 1;

		return (
			<span
				onClick={() => { if (isHidden) return; setState(setStateHandler); }}
				style={{ cursor, paddingLeft: '4px', paddingRight: '4px', opacity }}
			>
				{char}
			</span>
		);
	}

	function PageIndicator({ currentPageNav, pageCountNav, photos }) {
		return (
			<span style={{ padding: '0px 4px 0px 4px' }} title={`${photos.length} total photos`}>
				{`${currentPageNav} / ${pageCountNav}`}
			</span>
		);
	};

	function getPaddedCurrentPage(rawCurPage, pageCount) {
		const curPage = rawCurPage + 1;

		let curPageLog = Math.log10(curPage);
		if (curPageLog % 1 === 0) curPageLog += 1;

		const lCur = Math.ceil(curPageLog);
    const cMax = Math.ceil(Math.log10(pageCount));

		const n = lCur > cMax ? 0 : cMax - lCur;
    const zeroes = new Array(n).fill(0).join('');

    return `${zeroes}${curPage}`;
	}

	const { fetcher: { photos: { inProgress } }, setState, uploads: { currentPage, photos, photosPerPage } } = useContext(GlobalState);

	if (inProgress || photos.length <= 0) {
		return null;
	}

	const pageCount = Math.ceil(photos.length / photosPerPage);
	const hideLeft = currentPage === 0;
	const hideLeftLeft = hideLeft || currentPage === 1;
	const hideRight = currentPage + 1 === pageCount;
	const hideRightRight = hideRight || currentPage + 1 === pageCount - 1;

	const currentPageNav = getPaddedCurrentPage(currentPage, pageCount);

	return (
		<div id="photos-nav-container">
			<NavButton char={'<<'} isHidden={hideLeftLeft} setStateHandler={(prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: 0 }})} />
			<NavButton char={'<'} isHidden={hideLeft} setStateHandler={(prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: currentPage - 1 }})} />
			<PageIndicator currentPageNav={currentPageNav} pageCountNav={pageCount} photos={photos} />
			<NavButton char={'>'} isHidden={hideRight} setStateHandler={(prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: currentPage + 1 }})} />
			<NavButton char={'>>'} isHidden={hideRightRight} setStateHandler={(prev) => ({ ...prev, uploads: { ...prev.uploads, currentPage: pageCount - 1 }})} />
		</div>
	);
}

export default function Config() {
	const { fetcher: { photos: { inProgress } }, isAuthed, setState, uploads: { photos } } = useContext(GlobalState);

	const { isEnabled } = useFeatureFlags();
	const isAddPhotosEnabled = isEnabled(FEATURE_FLAGS.ADD_PHOTOS);

	useEffect(() => {
		if (isAuthed && inProgress === null) {
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
	}, [inProgress, isAuthed, photos, setState]);

	if (!isAuthed || !photos || inProgress) {
		return null;
	}

	let addPhotosLink = null;
	if (isAddPhotosEnabled) {
		addPhotosLink = <Link style={{ textDecoration: 'none' }} to="/photoUploader">+</Link>;
	}

	return (
		<>
			<div className="header">
				<span>
					Photos
					<span style={{ fontWeight: 'bold', position: 'absolute' }}>
						&nbsp;&nbsp;&nbsp;&nbsp;
						{addPhotosLink}
					</span>
				</span>
			</div>

			<Thumbnails photos={photos} />

			<PhotosNav />
		</>
	);
}
