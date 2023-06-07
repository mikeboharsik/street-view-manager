import { initialState } from '..';
import selectUploads, {
	selectMultiselect,
	selectPhoto,
	selectPhotos,
	selectPhotoPlaces,
	selectPlaces,
	selectThumbnails,
} from './selectUploads';

describe('initialState', () => {
	const state = initialState;

	describe('selectUploads', () => {
		it('returns initial value', () => {
			const result = selectUploads(state);
	
			expect(result).toBe(initialState.uploads);
		});
	});

	describe('selectMultiselect', () => {
		it('returns initial value', () => {
			const result = selectMultiselect(state);
	
			expect(result).toBe(initialState.uploads.multiselect);
		});
	});

	describe('selectPhoto', () => {
		it('returns undefined', () => {
			const result = selectPhoto(state);
	
			expect(result).toBeUndefined();
		});
	});

	describe('selectPhotos', () => {
		it('returns initial value', () => {
			const result = selectPhotos(state);
	
			expect(result).toBe(initialState.uploads.photos);
		});
	});

	describe('selectPhotoPlaces', () => {
		it('returns undefined', () => {
			const result = selectPhotoPlaces(state);
	
			expect(result).toBeUndefined();
		});
	});

	describe('selectPlaces', () => {
		it('returns initial value', () => {
			const result = selectPlaces(state);
	
			expect(result).toBe(initialState.uploads.places);
		});
	});

	describe('selectThumbnails', () => {
		it('returns initial value', () => {
			const result = selectThumbnails(state);
	
			expect(result).toBe(initialState.uploads.thumbnails);
		});
	});
});
