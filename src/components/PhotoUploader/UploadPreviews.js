import PanoramaViewer from '../PanoramaViewer/PanoramaViewer';

import './UploadPreviews.css';

import { UPLOAD_STATUS } from './PhotoUploader';

function getColorFromStatus(status) {
	const {
		COMPLETE,
		CREATING_PHOTO,
		CREATING_SESSION,
		ERROR,
		PENDING,
		UPLOADING_PHOTO,
	} = UPLOAD_STATUS;

	switch (status) {
		case PENDING:
			return 'white';

		case CREATING_SESSION:
		case UPLOADING_PHOTO:
		case CREATING_PHOTO:
			return 'orange';

		case COMPLETE:
			return 'green';

		case ERROR:
			return 'red';

		default:
			return 'white';
	}
}

function onCameraChange(cam) {
	// North is -90 (-1.57) on the Y

	let { rotation: { _x: x, _y: y, _z: z } } = cam;

	[x, y, z] = [x * (180 / Math.PI), y * (180 / Math.PI), z * (180 / Math.PI)];
}

function UploadPreview({ file, uploadProgress }) {
	const { status } = uploadProgress[file];

	const statusColor = getColorFromStatus(status);

	return (
		<div key={file.name} className="uploader-image-preview-container">
			<PanoramaViewer file={file} onChange={onCameraChange} />
			<div className="uploader-image-preview-container-image-overlay">
				<span className="uploader-image-preview-container-image-overlay-filename">
					<p>{file.name}</p>
					<p style={{ color: statusColor }}>{status}</p>
				</span>
			</div>
		</div>
	);
}

export default function UploadPreviews({ files, uploadProgress = {} }) {
	if (!files?.length) {
		return null;
	}

	return (
		<div id="uploader-image-previews-container">
			{files.map((file) => <UploadPreview file={file} key={file.name} uploadProgress={uploadProgress} />)}
		</div>
	);
}
