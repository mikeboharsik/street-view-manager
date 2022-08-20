export const initFeatureFlags = {
	HIDE_HASH_ERROR: {
		description: 'Suppress hash load error',
		isEnabled: false,
	},
	MODAL_TEST: {
		description: 'Add a button to the Utility Bar to test the Modal component',
		isEnabled: false,
	},
};

export const FEATURE_FLAGS = Object.keys(initFeatureFlags).reduce((a, c) => { a[c] = c.toString(); return a; }, {});

export function deserialize() {
	return JSON.parse(window.localStorage.getItem('featureFlags')) ?? {};
}

export function serialize(featureFlags) {
	window.localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
}

export function clear(){
	window.localStorage.setItem('featureFlags', JSON.stringify(initFeatureFlags));
};

export function isEnabled(name) {
	const { isEnabled = false } = get(name) ?? {};
	return isEnabled;
}

export function get(name){
	const featureFlags = deserialize();

	if (!name) {
		return featureFlags;
	}

	return featureFlags[name];
};

export function remove(name){
	const featureFlags = deserialize();
	delete featureFlags[name];
	serialize(featureFlags);
};

export function set(name, isEnabled){
	const featureFlags = deserialize();
	featureFlags[name] = { isEnabled };
	serialize(featureFlags);
};

export function initializeFeatureFlags(override = null) {
	const flagsToInitialize = override ?? initFeatureFlags;

	if (!window.localStorage.getItem('featureFlags')) {
		serialize(flagsToInitialize);
	} else {
		let featureFlags = deserialize();
		const newFeatureFlags = { ...flagsToInitialize, ...featureFlags };

		Object.keys(featureFlags).forEach((localFeatureFlag) => {
			if (!FEATURE_FLAGS[localFeatureFlag]) {
				delete newFeatureFlags[localFeatureFlag];
			}
		});

		serialize(newFeatureFlags);
	}
	
	const init = Object.keys(flagsToInitialize).reduce((a, flagName) => {
		const flagDescription = flagsToInitialize[flagName].description;

		a[flagDescription] = {
			toggle: (forceReload) => { set(flagName, !isEnabled(flagName)); if (forceReload) window.location.reload(); },
			isEnabled: () => isEnabled(flagName),
		};
		
		return a;
	}, {});
	
	window.SVM = {
		featureFlags: init,
		openApiRef: () => window.open('https://developers.google.com/streetview/publish/reference/rest', '_blank')
	};
}

export function getFeatureFlag(name) {
	const description = initFeatureFlags[name].description;

	return window.SVM?.featureFlags[description].isEnabled() ?? false;
}

initializeFeatureFlags();

export default FEATURE_FLAGS;
