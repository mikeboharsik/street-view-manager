import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { fetcher, ACTIONS } from '../../utilities';

import { UploadPreviews } from '.';

import './PhotoUploader.css';

const UPLOAD_STATUS = {
	PENDING: 'PENDING',

	CREATING_SESSION: 'CREATING_SESSION',
	UPLOADING_PHOTO: 'UPLOADING_PHOTO',
	CREATING_PHOTO: 'CREATING_PHOTO',

	COMPLETE: 'COMPLETE',
}

export default function PhotoUploader() {
	const [files, setFiles] = useState(null);
	const [uploadProgress, setUploadProgress] = useState({});

	useEffect(() => {}, [uploadProgress]);

	function handleFilesChange(e) {
		const newFiles = Array.from(e.target.files);
		
		newFiles.forEach((file) => file.localUrl = URL.createObjectURL(file));

		setUploadProgress((prev) => {
			const next = { ...prev };

			newFiles.forEach((file) => {
				next[file] = {
					createUrl: null,
					status: UPLOAD_STATUS.PENDING,
				};
			});

			return next;
		});

		setFiles(newFiles);
	}

	async function handleUpload() {
		files.forEach(async (file) => {
			let fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.CREATING_SESSION };

			try {
				setUploadProgress((prev) => {
					const next = { ...prev };
					next[file] = fileProgress;
					return next;
				});

				const { uploadUrl } = await fetcher(ACTIONS.CREATE_UPLOAD_SESSION).then((res) => res.json());

				fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.UPLOADING_PHOTO };
				setUploadProgress((prev) => {
					const next = { ...prev };
					next[file] = fileProgress;
					return next;
				});

				await fetcher(ACTIONS.UPLOAD_PHOTO, { body: await file.arrayBuffer(), uploadUrl });

				fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.CREATING_PHOTO };
				setUploadProgress((prev) => {
					const next = { ...prev };
					next[file] = fileProgress;
					return next;
				});

				await fetcher(ACTIONS.CREATE_PHOTO, { body: { uploadReference: { uploadUrl } } });

				fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.COMPLETE };
				setUploadProgress((prev) => {
					const next = { ...prev };
					next[file] = fileProgress;
					return next;
				});
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

	return (
		<div id="uploader-container">
			<input
				accept=".jpg"
				multiple="multiple"
				onChange={handleFilesChange}
				type="file"
			/>

			<UploadPreviews files={files} uploadProgress={uploadProgress} />

			<UploadButton />
		</div>
	);
}
