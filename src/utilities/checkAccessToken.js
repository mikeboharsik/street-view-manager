import { getCookie } from "../hooks/useCookies";

export default function checkAccessToken() {
	const access_token = getCookie('access_token');
  if (!access_token && window.location.pathname !== '/oauth') {
    const baseUri = 'https://accounts.google.com/o/oauth2/v2/auth';

    const clientId = process.env.REACT_APP_CLIENT_ID;

    const parameters = {
      scope: 'https://www.googleapis.com/auth/streetviewpublish',
      access_type: 'online',
      include_granted_scopes: 'true',
      response_type: 'token',
      redirect_uri: `${window.location.protocol}//${window.location.host}/oauth`,
      client_id: clientId,
    };

    const params = Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&');

    const url = `${baseUri}?${params}`;

    window.location.href = url;

    return false;
  }

  return true;
};
