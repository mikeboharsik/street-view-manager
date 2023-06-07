export function setCookie(key, val, expires) {
	let cookie = `${key}=${val}`;

	if (expires) {
		cookie = `${cookie};expires=${expires}`;
	}

	document.cookie = cookie;
}

export default function getCookies() {
	return document.cookie
		.split(';')
		.map(e => e.trim())
		.reduce((acc, cookie) => { const [key, val] = cookie.split('='); acc[key] = val; return acc; }, {});
}

export function getCookie(key) {
	return getCookies()[key];
}
