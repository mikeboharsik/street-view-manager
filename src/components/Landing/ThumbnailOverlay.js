import { useContext } from 'react';

import GlobalState from '../GlobalState';

import { Chain as ChainIcon, Eye as EyeIcon } from '../icons';

import './ThumbnailOverlay.css';

export default function ThumbnailOverlay({ photo }) {
	const { state: { uploads: { places } } } = useContext(GlobalState);

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
