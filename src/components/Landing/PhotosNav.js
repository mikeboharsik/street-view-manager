import { useContext } from 'react';
import GlobalState from '../GlobalState';
import { ACTIONS } from '../GlobalState/reducers/global';
import { selectFetcher, selectUploads } from '../GlobalState/selectors';

import './PhotosNav.css'

function NavButton({ char, id, isHidden, onClick }) {
	const cursor = isHidden ? 'default' : 'pointer';
	const opacity = isHidden ? 0 : 1;

	return (
		<span
			id={id}
			onClick={() => { if (isHidden) return; onClick(); }}
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

export default function PhotosNav() {
	const { dispatch, state } = useContext(GlobalState);

	const { inProgress } = selectFetcher(state, 'photos');
	const { currentPage, photos, photosPerPage } = selectUploads(state);

	if (inProgress || !photos || photos.length <= 0) {
		return null;
	}

	const pageCount = Math.ceil(photos.length / photosPerPage);
	const hideLeft = currentPage === 0;
	const hideLeftLeft = hideLeft || currentPage === 1;
	const hideRight = currentPage + 1 === pageCount;
	const hideRightRight = hideRight || currentPage + 1 === pageCount - 1;

	const currentPageNav = getPaddedCurrentPage(currentPage, pageCount);
	
	const leftLeftHandler = () => dispatch({ type: ACTIONS.SET_CURRENTPAGE_FIRST });
	const leftHandler = () => dispatch({ type: ACTIONS.DECREMENT_CURRENTPAGE });
	const rightHandler = () => dispatch({ type: ACTIONS.INCREMENT_CURRENTPAGE });
	const rightRightHandler = () => dispatch({ type: ACTIONS.SET_CURRENTPAGE_LAST });

	return (
		<div id="photos-nav-container">
			<NavButton char={'<<'} id="navigateLeftLeft" isHidden={hideLeftLeft} onClick={leftLeftHandler} />
			<NavButton char={'<'} id="navigateLeft" isHidden={hideLeft} onClick={leftHandler} />
			<PageIndicator currentPageNav={currentPageNav} pageCountNav={pageCount} photos={photos} />
			<NavButton char={'>'} id="navigateRight" isHidden={hideRight} onClick={rightHandler} />
			<NavButton char={'>>'} id="navigateRightRight" isHidden={hideRightRight} onClick={rightRightHandler} />
		</div>
	);
}
