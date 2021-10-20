import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { fetcher, ACTIONS } from '../../utilities';

import './PhotoUploader.css';

const UPLOAD_STATUS = {
	PENDING: 'PENDING',
	IN_PROGRESS: 'IN_PROGRESS',
	COMPLETE: 'COMPLETE',
}

export default function PhotoUploader() {
	const [files, setFiles] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(null);

	useEffect(() => {}, [uploadProgress]);

	function handleFilesChange(e) {
		const newFiles = Array.from(e.target.files);
		
		newFiles.forEach((file) => file.localUrl = URL.createObjectURL(file));

		setFiles(newFiles);
	}

	async function handleUpload() {
		const newUploadProgress = files.map((file) => ({
			createUrl: null,
			file,
			status: UPLOAD_STATUS.PENDING,
		}));

		setUploadProgress(newUploadProgress);

		newUploadProgress.forEach(async (upload) => {
			try {
				const { file } = upload;

				const { uploadUrl } = await fetcher(ACTIONS.CREATE_UPLOAD_SESSION).then((res) => res.json());

				await fetcher(ACTIONS.UPLOAD_PHOTO, { body: await file.arrayBuffer(), uploadUrl });
			} catch(e) {
				console.error('Encountered unhandled exception when uploading new photo:', e);

				toast(e.message, { type: 'error' });
			}
		});
	}

	function UploadButton() {
		if (files?.length > 0) {
			return <input onClick={handleUpload} type="button" value="Upload" />;
		}
		
		return null;
	}

	function ImagePreviews() {
		if (files?.length > 0) {
			return files.map((file) => (
				<div key={file.name} className="uploader-image-preview-container">
					<img alt={file.name} className="uploader-image-preview-image" src={file.localUrl} title={file.name} />
					<div className="uploader-image-preview-container-image-overlay">
						<span className="uploader-image-preview-container-image-overlay-filename">
							{file.name}
						</span>
					</div>
				</div>
			));
		}

		return null;
	}

	return (
		<div id="uploader-container">
			<input
				accept=".jpg"
				multiple="multiple"
				onChange={handleFilesChange}
				style={{}}
				type="file"
			/>

			<ImagePreviews />

			<UploadButton />
		</div>
	);
}
