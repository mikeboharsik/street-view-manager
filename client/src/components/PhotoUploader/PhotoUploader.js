import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';

import { ACTIONS } from '../GlobalState/reducers/global';
import { fetcher, ACTIONS as FETCHER_ACTIONS } from '../../utilities';

import { UploadPreviews } from '.';

import './PhotoUploader.css';
import { useDispatch } from '../../hooks';

export const UPLOAD_STATUS = {
	PENDING: 'PENDING',

	CREATING_SESSION: 'CREATING_SESSION',
	UPLOADING_PHOTO: 'UPLOADING_PHOTO',
	CREATING_PHOTO: 'CREATING_PHOTO',

	ERROR: 'ERROR',

	COMPLETE: 'COMPLETE',
}

export default function PhotoUploader() {
	const history = useHistory();

	const dispatch = useDispatch();

	const [files, setFiles] = useState(null);
	const [uploadProgress, setUploadProgress] = useState({});

	function handleFilesChange(e) {
		let newFiles = Array.from(e.target.files);

		if (newFiles.length > 9) {
			toast('Only 9 images are supported simultaneously at the moment', { type: 'info' });
			newFiles = newFiles.slice(0, 9);
		}
		
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
	};

	async function handleUpload(file) {
		let fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.CREATING_SESSION };

		try {
			setUploadProgress((prev) => {
				const next = { ...prev };
				next[file] = fileProgress;
				return next;
			});

			const { uploadUrl } = await fetcher(FETCHER_ACTIONS.CREATE_UPLOAD_SESSION).then((res) => res.json());

			fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.UPLOADING_PHOTO };
			setUploadProgress((prev) => {
				const next = { ...prev };
				next[file] = fileProgress;
				return next;
			});

			await fetcher(FETCHER_ACTIONS.UPLOAD_PHOTO, { body: await file.arrayBuffer(), uploadUrl });

			fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.CREATING_PHOTO };
			setUploadProgress((prev) => {
				const next = { ...prev };
				next[file] = fileProgress;
				return next;
			});

			const photoResult = await fetcher(FETCHER_ACTIONS.CREATE_PHOTO, { body: { uploadReference: { uploadUrl } } });
			const ob = await photoResult.json();
			ob.local = { originalFilename: file.name };

			if (!photoResult.ok) {
				const { error: { code, message, status } } = ob;
				throw new Error(`Response code is ${code}, message is ${message}, status is ${status}`);
			}

			dispatch({ payload: { photos: [ob] }, type: ACTIONS.ADD_PHOTOS });
			dispatch({ payload: { reverse: true, sortProp: 'captureTime' }, type: ACTIONS.SORT_PHOTOS });

			fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.COMPLETE };
			setUploadProgress((prev) => {
				const next = { ...prev };
				next[file] = fileProgress;
				return next;
			});			
		} catch(e) {
			fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.ERROR };
			setUploadProgress((prev) => {
				const next = { ...prev };
				next[file] = fileProgress;
				return next;
			});

			console.error('Encountered unhandled exception when uploading new photo:', e);
		}
	};

	async function handleUploads() {
		const uploadJobs = files.map((file) => handleUpload(file));

		const results = await Promise.allSettled(uploadJobs);

		const statuses = results.map((result) => result.status);
		if (statuses.includes('rejected')) {
			toast('At least one image failed to upload, check log for details', { autoClose: false, type: 'error' });
		} else {
			toast('All photos uploaded!', { type: 'success' });
			history.push('/');
		}
	}

	function UploadButton() {
		if (files?.length > 0) {
			return <input onClick={handleUploads} type="button" value="Upload" />;
		}
		
		return null;
	}

	return (
		<div id="uploader-container">
			<input
				accept=".jpg"
				onChange={handleFilesChange}
				multiple
				type="file"
			/>

			<UploadPreviews files={files} uploadProgress={uploadProgress} />

			<UploadButton />
		</div>
	);
}
