import { initialState } from '..';
import selectFetcher from './selectFetcher';

describe('selectFetcher', () => {
	describe('initialState', () => {
		const state = initialState;

		const validTypes = Object.keys(initialState.fetcher);

		validTypes.forEach((validType) => {
			it(`${validType} returns initial value`, () => {
				const type = validType;
		
				const result = selectFetcher(state, type);
		
				expect(result).toBe(initialState.fetcher[validType]);
			});
		});
	});
});
