const initFeatureFlags = {
	ADD_PHOTOS: {
		isEnabled: false,
	},
	UTILITY_BAR: {
		isEnabled: false,
	}
};

export const FEATURE_FLAGS = Object.keys(initFeatureFlags).reduce((a, c) => { a[c] = c.toString(); return a; }, {});

export default function useFeatureFlags() {
	function clear(){
		window.localStorage.setItem('featureFlags', JSON.stringify(initFeatureFlags));
	};

	function isEnabled(name) {
		const { isEnabled } = get(name);
		return isEnabled;
	}

	function get(name){
		const featureFlags = JSON.parse(window.localStorage.getItem('featureFlags'));
		return featureFlags[name];
	};

	function remove(name){
		const featureFlags = JSON.parse(window.localStorage.getItem('featureFlags'));
		delete featureFlags[name];
		window.localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
	};

	function set(name, isEnabled){
		const featureFlags = JSON.parse(window.localStorage.getItem('featureFlags'));
		featureFlags[name] = { isEnabled };
		window.localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
	};

	if (!window.localStorage.getItem('featureFlags')) {
		window.localStorage.setItem('featureFlags', JSON.stringify(initFeatureFlags));
	} else {
		let featureFlags = JSON.parse(window.localStorage.getItem('featureFlags'));
		const newFeatureFlags = { ...initFeatureFlags, ...featureFlags };
		window.localStorage.setItem('featureFlags', JSON.stringify(newFeatureFlags));
	}

	return { clear, get, isEnabled, remove, set };
};
