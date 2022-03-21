import { initialState } from '..';
import selectMeta from './selectMeta';

describe('selectMeta', () => {
	describe('initialState', () => {
		const state = initialState;

		it('returns initial value', () => {
			const result = selectMeta(state);
	
			expect(result).toBe(initialState.meta);
		});
	});
});
