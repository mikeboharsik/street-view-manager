import { getCookie } from '../hooks/useCookies';

const BASE_URL = 'https://streetviewpublish.googleapis.com';

export const ACTIONS = {
	GET_PHOTO: 'GET_PHOTO',
	GET_PHOTOS: 'GET_PHOTOS',
	UPDATE_PHOTO: 'UPDATE_PHOTO',
};

const URIS = {
	[ACTIONS.GET_PHOTO]: `${BASE_URL}/v1/photo/{photoId}`,
	[ACTIONS.GET_PHOTOS]: `${BASE_URL}/v1/photos`,
	[ACTIONS.UPDATE_PHOTO]: `${BASE_URL}/v1/photo/{photoId}`,
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

			uri += '?view=INCLUDE_DOWNLOAD_URL&pageSize=16';

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
		default:
			break;
	}

	return fetch(uri, options);
}
