import fetcher, { ACTIONS, URIS, verifyBodyIsString } from './fetcher';
import { getCookie } from './getCookies';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('./getCookies', () => ({
	getCookie: jest.fn(),
}));

describe('verifyBodyIsString', () => {
	it('returns argument when argument is string', () => {
		const testBody = '{"test":true}';

		const result = verifyBodyIsString(testBody);

		expect(result).toEqual(testBody);
	});

	it('returns string when argument is not a string', () => {
		const testBody = { test: true };

		const result = verifyBodyIsString(testBody);

		expect(result).toEqual('{"test":true}');
	});
});

describe('fetcher', () => {
	describe('missing action', () => {
		it('returns a rejected promise with the correct message', async () => {
			await expect(fetcher()).rejects.toEqual('Missing fetcher action');
		});
	});

	describe('missing access token', () => {
		it('returns a rejected promise with the correct message', async () => {
			await expect(fetcher('MOCK_ACTION')).rejects.toEqual('Missing access token');
		});
	});

	describe(`${ACTIONS.CREATE_PHOTO}`, () => {
		beforeEach(() => {
			getCookie.mockReturnValue('TEST_ACCESS_TOKEN');
		});

		it('is called with authorization header and method POST', () => {
			const expectedUri = URIS[ACTIONS.CREATE_PHOTO];

			fetcher(ACTIONS.CREATE_PHOTO);

			expect(mockFetch).toHaveBeenCalledWith(expectedUri, { headers: { Authorization: 'Bearer TEST_ACCESS_TOKEN' }, method: 'POST' });
		});
	});

	describe(`${ACTIONS.CREATE_UPLOAD_SESSION}`, () => {
		beforeEach(() => {
			getCookie.mockReturnValue('TEST_ACCESS_TOKEN');
		});

		it('is called with authorization header and method POST', () => {
			const expectedUri = URIS[ACTIONS.CREATE_UPLOAD_SESSION];

			fetcher(ACTIONS.CREATE_UPLOAD_SESSION);

			expect(mockFetch).toHaveBeenCalledWith(expectedUri, { headers: { Authorization: 'Bearer TEST_ACCESS_TOKEN' }, method: 'POST' });
		});
	});

	describe(`${ACTIONS.DELETE_PHOTOS}`, () => {
		beforeEach(() => {
			getCookie.mockReturnValue('TEST_ACCESS_TOKEN');
		});

		it('throws an error when body is not provided', async () => {
			await expect(fetcher(ACTIONS.DELETE_PHOTOS)).rejects.toEqual('Missing body');
		});

		it('is called with authorization header, method POST, and body when body is provided', () => {
			const expectedUri = URIS[ACTIONS.DELETE_PHOTOS];

			fetcher(ACTIONS.DELETE_PHOTOS, { body: { photoIds: [ 'MOCK_PHOTO_ID_1', 'MOCK_PHOTO_ID_2' ] } });

			expect(mockFetch).toHaveBeenCalledWith(expectedUri, {
				body: '{"photoIds":["MOCK_PHOTO_ID_1","MOCK_PHOTO_ID_2"]}',
				headers: {
					Authorization: 'Bearer TEST_ACCESS_TOKEN',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
		});
	});

	describe(`${ACTIONS.GET_PHOTO}`, () => {
		beforeEach(() => {
			getCookie.mockReturnValue('TEST_ACCESS_TOKEN');
		});

		it('throws an error when photoId is not provided', async () => {
			await expect(fetcher(ACTIONS.GET_PHOTO)).rejects.toEqual('Missing photoId');
		});

		it('is called with authorization header, method GET, and correct URI when photoId is provided', () => {
			const mockPhotoId = 'MOCK_PHOTO_ID';

			let expectedUri = URIS[ACTIONS.GET_PHOTO];
			expectedUri = expectedUri.replace('{photoId}', mockPhotoId);
			expectedUri += '?view=INCLUDE_DOWNLOAD_URL';

			fetcher(ACTIONS.GET_PHOTO, { photoId: mockPhotoId });

			expect(mockFetch).toHaveBeenCalledWith(expectedUri, {
				headers: { Authorization: 'Bearer TEST_ACCESS_TOKEN' },
				method: 'GET',
			});
		});
	});

	describe(`${ACTIONS.UPDATE_PHOTOS}`, () => {
		beforeEach(() => {
			getCookie.mockReturnValue('TEST_ACCESS_TOKEN');
		});

		it('throws an error when body is not provided', async () => {
			await expect(fetcher(ACTIONS.UPDATE_PHOTOS)).rejects.toEqual('Request body is missing');
		});

		it('is called with correct headers, method POST, and correct URI when body is provided', () => {
			const mockOptions = {
				body: {
					updatePhotoRequests: [{ photoId: { id: 'MOCK_PHOTO_ID' }}],
				},
			};
			const expectedUri = URIS[ACTIONS.UPDATE_PHOTOS];

			fetcher(ACTIONS.UPDATE_PHOTOS, mockOptions);

			expect(mockFetch).toHaveBeenCalledWith(expectedUri, {
				body: JSON.stringify(mockOptions.body),
				headers: {
					Authorization: 'Bearer TEST_ACCESS_TOKEN',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
		});
	});
});
