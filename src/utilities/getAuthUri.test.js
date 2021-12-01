import getAuthUri from './getAuthUri';

describe('getAuthUri', () => {
	it('returns the expected URI', () => {
		process.env.REACT_APP_CLIENT_ID = 'MOCK_CLIENT_ID';
		
		delete window.location;
		window.location = new URL('http://mockhost.com');

		const authUri = getAuthUri();

		expect(authUri).toEqual(`https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/streetviewpublish&access_type=online&include_granted_scopes=true&response_type=token&redirect_uri=http://mockhost.com/oauth&client_id=MOCK_CLIENT_ID`);
	});
});
