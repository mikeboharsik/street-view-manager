export default function getAuthUri() {
	const baseUri = 'https://accounts.google.com/o/oauth2/v2/auth';

	const clientId = process.env.REACT_APP_CLIENT_ID;

	const parameters = {
		scope: 'https://www.googleapis.com/auth/streetviewpublish https://www.googleapis.com/auth/userinfo.email',
		access_type: 'online',
		include_granted_scopes: 'true',
		response_type: 'token',
		redirect_uri: `${window.location.protocol}//${window.location.host}/oauth`,
		client_id: clientId,
	};

	const params = Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&');

	return `${baseUri}?${params}`;
}
