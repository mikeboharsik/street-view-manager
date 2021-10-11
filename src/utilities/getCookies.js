export function setCookie(key, val, expires) {
	let cookie = `${key}=${val}`;

	if (expires) {
		cookie = `${cookie};expires=${expires}`;
	}

	document.cookie = cookie;
}

export function getCookie(key) {
	return document.cookie
		.split(';')
		.reduce((acc, cookie) => { const [key, val] = cookie.split('='); acc[key] = val; return acc; }, {})[key];
}

export default function getCookies() {
	return document.cookie
		.split(';')
		.reduce((acc, cookie) => { const [key, val] = cookie.split('='); acc[key] = val; return acc; }, {});
}
