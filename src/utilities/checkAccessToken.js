import { getCookie } from "../hooks/useCookies";

export default function checkAccessToken(setState) {
  setState?.((prev) => ({ ...prev, showLoader: true }));

	const access_token = getCookie('access_token');
  if (!access_token) {
    const baseUri = 'https://accounts.google.com/o/oauth2/v2/auth';

    const clientId = process.env.NODE_ENV === 'production' ? '927910378932-7gbkkgr02ptrvl577flg6k38a90pq2nr.apps.googleusercontent.com' : '927910378932-v9avf10ud1a4hmmk123iihrvckv90ie1.apps.googleusercontent.com';

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

    return null;
  }

  setState?.((prev) => ({ ...prev, showLoader: false }));

  return access_token;
};
