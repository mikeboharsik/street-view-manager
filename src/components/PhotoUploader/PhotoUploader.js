import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { fetcher, ACTIONS } from '../../utilities';

const UPLOAD_STATUS = {
	PENDING: 'PENDING',
	IN_PROGRESS: 'IN_PROGRESS',
	COMPLETE: 'COMPLETE',
}

export default function PhotoUploader() {
	const [files, setFiles] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(null);

	useEffect(() => {
		console.log({ uploadProgress });
	}, [uploadProgress]);

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
				<div key={file.name} style={{ display: 'flex', margin: 0, padding: 0, position: 'relative' }}>
					<img alt={file.name} src={file.localUrl} style={{ maxWidth: '300px' }} title={file.name} />
					<div style={{ alignItems: 'center', display: 'flex', height: '100%', justifyContent: 'center', position: 'absolute', width: '100%' }}>
						<span style={{ color: 'white', filter: 'drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)', userSelect: 'none' }}>
							{file.name}
						</span>
					</div>
				</div>
			));
		}

		return null;
	}

	return (
		<div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
