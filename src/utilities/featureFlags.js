export const initFeatureFlags = {
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
	const { isEnabled } = get(name);
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
		serialize(newFeatureFlags);
	}
	
	const init = Object.keys(flagsToInitialize).reduce((a, flagName) => {
		const flagDescription = flagsToInitialize[flagName].description;

		a[flagDescription] = {
			disable: (forceReload) => { set(flagName, false); if (forceReload) window.location.reload(); },
			enable: (forceReload) => { set(flagName, true); if (forceReload) window.location.reload(); },
			isEnabled: () => isEnabled(flagName),
			remove: (forceReload) => { remove(flagName); if (forceReload) window.location.reload(); },
		};
		
		return a;
	}, {});
	
	window.SVM = {
		featureFlags: init,
	};
}

export function getFeatureFlag(name) {
	const description = initFeatureFlags[name].description;

	return window.SVM?.featureFlags[description].isEnabled() ?? false;
}

initializeFeatureFlags();

export default FEATURE_FLAGS;
