import { getCookie } from "./getCookies";

export default function checkAccessToken() {
	const access_token = getCookie('access_token');
  if (!access_token && window.location.pathname !== '/oauth') {
    return false;
  }

  return true;
};
