import { getCookie } from './getCookies';

const BASE_URL = 'https://streetviewpublish.googleapis.com';

export const ACTIONS = {
	CREATE_PHOTO: 'CREATE_PHOTO',
	CREATE_UPLOAD_SESSION: 'CREATE_UPLOAD_SESSION',
	GET_PHOTO: 'GET_PHOTO',
	GET_PHOTOS: 'GET_PHOTOS',
	UPDATE_PHOTO: 'UPDATE_PHOTO',
	UPDATE_PHOTOS: 'UPDATE_PHOTOS',
	UPLOAD_PHOTO: 'UPLOAD_PHOTO',
};

const URIS = {
	[ACTIONS.CREATE_PHOTO]: `${BASE_URL}/v1/photo`,
	[ACTIONS.CREATE_UPLOAD_SESSION]: `${BASE_URL}/v1/photo:startUpload`,
	[ACTIONS.GET_PHOTO]: `${BASE_URL}/v1/photo/{photoId}`,
	[ACTIONS.GET_PHOTOS]: `${BASE_URL}/v1/photos`,
	[ACTIONS.UPDATE_PHOTO]: `${BASE_URL}/v1/photo/{photoId}`,
	[ACTIONS.UPDATE_PHOTOS]: `${BASE_URL}/v1/photos:batchUpdate`,
}

export default function fetcher(action, args) {
	const access_token = getCookie('access_token');
	if (!access_token) {
		return;
	}

	let method = 'GET';

	const headers = {
		Authorization: `Bearer ${access_token}`,
	};

	const options = { headers, method };
	
	let uri = URIS[action];

	switch(action) {
		case ACTIONS.CREATE_PHOTO:
		case ACTIONS.CREATE_UPLOAD_SESSION: {
			options.method = 'POST';

			break;
		}
		case ACTIONS.GET_PHOTO: {
			const { photoId } = args;

			if (!photoId) {
				throw new Error('Missing photoId');
			}

			uri = uri.replace('{photoId}', photoId);
			uri += `?view=INCLUDE_DOWNLOAD_URL`;
			break;
		}
		case ACTIONS.GET_PHOTOS: {
			const { pageToken } = args;

			uri += '?view=INCLUDE_DOWNLOAD_URL&pageSize=100';

			if (pageToken) {
				uri += `&pageToken=${pageToken}`;
			}

			break;
		}
		case ACTIONS.UPDATE_PHOTO: {
			const { photoId, query, body } = args;

			if (!photoId || !query || !body) {
				throw new Error('Missing required data');
			}

			uri = uri.replace('{photoId}', photoId);

			const queryData = Object.keys(query).map((key) => `${key}=${query[key]}`).join('&');
			uri += `?${queryData}`;

			options.body = typeof body == 'string' ? body : JSON.stringify(body);
			options.method = 'PUT';
			break;
		}
		case ACTIONS.UPDATE_PHOTOS: {
			const { body } = args;

			if (!body) {
				throw new Error('Missing required data');
			}

			options.body = typeof body == 'string' ? body : JSON.stringify(body);
			options.method = 'POST';
			break;
		}
		case ACTIONS.UPLOAD_PHOTO: {
			const { body, uploadUrl } = args;

			uri = uploadUrl;

			options.body = body;
			options.method = 'POST';
			options.headers = { ...options.headers, 'content-type': 'image/jpeg' };

			break;
		}
		default:
			break;
	}

	return fetch(uri, options);
}
