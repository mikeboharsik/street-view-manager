export const initFeatureFlags = {
	ADD_PHOTOS: {
		isEnabled: false,
	},
	UTILITY_BAR: {
		isEnabled: false,
	}
};

export const FEATURE_FLAGS = Object.keys(initFeatureFlags).reduce((a, c) => { a[c] = c.toString(); return a; }, {});

export function deserialize() {
	return JSON.parse(window.localStorage.getItem('featureFlags')) ?? {};
}

export function serialize(featureFlags) {
	window.localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
}

export default function getFeatureFlags() {
	function clear(){
		window.localStorage.setItem('featureFlags', JSON.stringify(initFeatureFlags));
	};

	function isEnabled(name) {
		const { isEnabled } = get(name);
		return isEnabled;
	}

	function get(name){
		const featureFlags = deserialize();

		if (!name) {
			return featureFlags;
		}

		return featureFlags[name];
	};

	function remove(name){
		const featureFlags = deserialize();
		delete featureFlags[name];
		serialize(featureFlags);
	};

	function set(name, isEnabled){
		const featureFlags = deserialize();
		featureFlags[name] = { isEnabled };
		serialize(featureFlags);
	};

	if (!window.localStorage.getItem('featureFlags')) {
		serialize(initFeatureFlags);
	} else {
		let featureFlags = deserialize();
		const newFeatureFlags = { ...initFeatureFlags, ...featureFlags };
		serialize(newFeatureFlags);
	}

	return { clear, get, isEnabled, remove, set };
};
