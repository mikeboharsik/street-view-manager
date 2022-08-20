import { getCookie } from "./getCookies";

export default function checkAccessToken() {
	const access_token = getCookie('access_token');
  if (!access_token) {
    return false;
  }

  return true;
};
