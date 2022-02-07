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

				toast('Photo uploaded!', { type: 'success' });

				history.push('/');
			} catch(e) {
				fileProgress = { ...uploadProgress[file], status: UPLOAD_STATUS.ERROR };
				setUploadProgress((prev) => {
					const next = { ...prev };
					next[file] = fileProgress;
					return next;
				});

				console.error('Encountered unhandled exception when uploading new photo:', e);

				toast(e.message, { autoClose: false, type: 'error' });
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
				onChange={handleFilesChange}
				multiple
				type="file"
			/>

			<UploadPreviews files={files} uploadProgress={uploadProgress} />

			<UploadButton />
		</div>
	);
}
