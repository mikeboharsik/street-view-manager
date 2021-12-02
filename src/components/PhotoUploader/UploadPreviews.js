import PanoramaViewer from '../PanoramaViewer/PanoramaViewer';

import './UploadPreviews.css';

function onCameraChange(cam) {
	// North is -90 (-1.57) on the Y

	let { rotation: { _x: x, _y: y, _z: z } } = cam;

	[x, y, z] = [x * (180 / Math.PI), y * (180 / Math.PI), z * (180 / Math.PI)];
}

function UploadPreview({ file, uploadProgress }) {
	return (
		<div key={file.name} className="uploader-image-preview-container">
			<PanoramaViewer file={file} onChange={onCameraChange} />
			<div className="uploader-image-preview-container-image-overlay">
				<span className="uploader-image-preview-container-image-overlay-filename">
					<p>{file.name}</p>
					<p>{`${uploadProgress[file]?.status}`}</p>
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
