import getFeatureFlags, { deserialize, initFeatureFlags, serialize } from './getFeatureFlags';

const TEST_FLAG = 'TEST_FLAG';

describe('getFeatureFlags', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	describe('deserialize', () => {
		describe('empty local storage', () => {
			it('returns empty object', () => {
				const result = deserialize();

				expect(result).toEqual({});
			});
		});

		describe('non-empty local storage', () => {
			it('returns valid non-empty JSON object', () => {
				const testObject = { test: true };
				window.localStorage.setItem('featureFlags', JSON.stringify(testObject));

				const result = deserialize();

				expect(result).toEqual(testObject);
			});
		});
	});

	describe('get', () => {
		it('is given an argument and returns only that feature flag', () => {
			const featureFlags = getFeatureFlags();
			featureFlags.set(TEST_FLAG, true);

			expect(featureFlags.get(TEST_FLAG)).toEqual({ isEnabled: true });
		});

		it('is given no argument and returns entire feature flag object', () => {
			const featureFlags = getFeatureFlags();
			featureFlags.set(TEST_FLAG, true);

			expect(featureFlags.get()).toEqual({ ...initFeatureFlags, TEST_FLAG: { isEnabled: true } });
		});
	});
	
	describe('initial state', () => {
		it('initializes feature flags in localStorage', () => {
			getFeatureFlags();

			const result = deserialize();

			expect(result).toEqual(initFeatureFlags);
		});
	});

	describe('isEnabled', () => {
		it('returns false when the feature is not enabled', () => {
			window.localStorage.setItem('featureFlags', '{"TEST_FLAG":{"isEnabled":false}}');
			const featureFlags = getFeatureFlags();

			expect(featureFlags.isEnabled(TEST_FLAG)).toBe(false);
		});

		it('returns true when the feature is enabled', () => {
			window.localStorage.setItem('featureFlags', '{"TEST_FLAG":{"isEnabled":true}}');
			const featureFlags = getFeatureFlags();

			expect(featureFlags.isEnabled(TEST_FLAG)).toBe(true);
		});
	});

	describe('remove', () => {
		it('removes the specified feature flag', () => {
			const featureFlags = getFeatureFlags();

			featureFlags.remove(TEST_FLAG);

			const { TEST_FLAG: result } = deserialize();

			expect(result).toBeUndefined();
		});
	});

	describe('serialize', () => {
		it('populates featureFlags with a stringified version of the argument', () => {
			const testObject = { TEST_FLAG: { isEnabled: false } };

			serialize(testObject);

			expect(window.localStorage.getItem('featureFlags')).toEqual(JSON.stringify(testObject));
		});
	});

	describe('set', () => {
		it('creates a feature flag and enables it', () => {
			const featureFlags = getFeatureFlags();

			featureFlags.set(TEST_FLAG, true);

			const { TEST_FLAG: result } = deserialize();

			expect(result).toEqual({ isEnabled: true });
		});
	});
});
