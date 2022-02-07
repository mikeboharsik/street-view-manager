import { FEATURE_FLAGS } from '.';
import {
	deserialize,
	get,
	initFeatureFlags,
	initializeFeatureFlags,
	isEnabled,
	remove,
	serialize,
	set,
} from './featureFlags';

const TEST_FLAG = 'TEST_FLAG';

describe('featureFlags', () => {
	describe('helper functions', () => {
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
	
		describe('serialize', () => {
			it('populates featureFlags with a stringified version of the argument', () => {
				const testObject = { TEST_FLAG: { isEnabled: false } };
	
				serialize(testObject);
	
				expect(window.localStorage.getItem('featureFlags')).toEqual(JSON.stringify(testObject));
			});
		});
	
		describe('get', () => {
			it('is given an argument and returns only that feature flag', () => {
				set(TEST_FLAG, true);
	
				const result = get(TEST_FLAG);
	
				expect(result).toEqual({ isEnabled: true });
			});
	
			it('is given no argument and returns entire feature flag object', () => {
				set(TEST_FLAG, true);
	
				const result = get();
	
				expect(result).toEqual({ TEST_FLAG: { isEnabled: true } });
			});
		});
		
		describe('initial state', () => {
			it('initializes feature flags in localStorage', () => {
				const result = deserialize();
	
				expect(result).toEqual({});
			});
		});
	
		describe('isEnabled', () => {
			it('returns false when the feature is not enabled', () => {
				window.localStorage.setItem('featureFlags', '{"TEST_FLAG":{"isEnabled":false}}');
	
				expect(isEnabled(TEST_FLAG)).toBe(false);
			});
	
			it('returns true when the feature is enabled', () => {
				window.localStorage.setItem('featureFlags', '{"TEST_FLAG":{"isEnabled":true}}');
	
				expect(isEnabled(TEST_FLAG)).toBe(true);
			});
		});
	
		describe('remove', () => {
			it('removes the specified feature flag', () => {
				remove(TEST_FLAG);
	
				const { TEST_FLAG: result } = deserialize();
	
				expect(result).toBeUndefined();
			});
		});
	
		describe('set', () => {
			it('creates a feature flag and enables it', () => {
				set(TEST_FLAG, true);
	
				const { TEST_FLAG: result } = deserialize();
	
				expect(result).toEqual({ isEnabled: true });
			});
		});
	});

	describe('SVM.featureFlags', () => {
		const mockFeatureFlags = {
			[TEST_FLAG]: { description: 'test', isEnabled: false },
		};

		beforeEach(() => {
			initializeFeatureFlags(mockFeatureFlags);
		});

		describe('feature functions', () => {
			it('verifies all functions exist', () => {
				const functions = ['disable', 'enable', 'isEnabled', 'remove'];
				const description = mockFeatureFlags[TEST_FLAG].description;
				const mockFeatureFlag = window.SVM.featureFlags[description];

				expect(Object.keys(mockFeatureFlag)).toHaveLength(functions.length);

				functions.forEach((fn) => {
					expect(typeof mockFeatureFlag[fn]).toEqual('function');
				});
			});
		});;
	});
});
