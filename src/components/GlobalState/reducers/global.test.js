import initialState from '../initialState';
import globalReducer, { ACTIONS } from './global';

function generatePhoto() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let id = Array(16).fill();
	id.forEach((c, i, a) => {
		const idx = parseInt(Math.random() * chars.length);
		a[i] = chars[idx];
	});
	id = id.join('');

	return {
		photoId: {
			id,
		},
	};
}

describe('fetcher', () => {
	describe('SET_FETCHER', () => {
		it('updates inProgress correctly', () => {
			const action1 = { payload: { inProgress: true, type: 'gitHash' }, type: ACTIONS.SET_FETCHER };
			const action2 = { payload: { inProgress: false, type: 'gitHash' }, type: ACTIONS.SET_FETCHER };
	
			const state1 = globalReducer(initialState, action1);
			expect(state1.fetcher.gitHash.inProgress).toEqual(true);
	
			const state2 = globalReducer(state1, action2);
			expect(state2.fetcher.gitHash.inProgress).toEqual(false);
		});
	});
});

describe('isAuthed', () => {
	describe('SET_ISAUTHED', () => {
		it('updates isAuthed correctly', () => {
			const action1 = { payload: { isAuthed: true }, type: ACTIONS.SET_ISAUTHED };
			const action2 = { payload: { isAuthed: false }, type: ACTIONS.SET_ISAUTHED };
	
			const state1 = globalReducer(initialState, action1);
			expect(state1.isAuthed).toBe(true);
	
			const state2 = globalReducer(state1, action2);
			expect(state2.isAuthed).toBe(false);
		});
	});
});

describe('meta', () => {
	describe('SET_GITHASH', () => {
		it('updates gitHash correctly', () => {
			const testValue = 'some random git hash';
			const action = { payload: { gitHash: testValue }, type: ACTIONS.SET_GITHASH };
	
			const state = globalReducer(initialState, action);
			expect(state.meta.gitHash).toBe(testValue);
		});
	});
});

describe('modal', () => {
	describe('SET_MODAL', () => {
		it('updates form correctly', () => {
			const testComponent = <div>Test</div>;
			const action = { payload: { form: testComponent }, type: ACTIONS.SET_MODAL };
	
			const state = globalReducer(initialState, action);
			expect(state.modal.form).toBe(testComponent);
		});
	});
});

describe('showLoader', () => {
	describe('SET_SHOWLOADER', () => {
		it('updates showLoader correctly', () => {
			const action1 = { payload: { showLoader: true }, type: ACTIONS.SET_SHOWLOADER };
			const action2 = { payload: { showLoader: false }, type: ACTIONS.SET_SHOWLOADER };
	
			const state1 = globalReducer(initialState, action1);
			expect(state1.showLoader).toBe(true);
	
			const state2 = globalReducer(state1, action2);
			expect(state2.showLoader).toBe(false);
		});
	});
});

describe('uploads', () => {
	describe('currentPage', () => {
		const testPageCount = 5;

		let initialPhotos = Array(initialState.uploads.photosPerPage * testPageCount).fill();
		initialPhotos.forEach((c, i, a) => {
			a[i] = generatePhoto();
		});

		const initState = { ...initialState, uploads: { ...initialState.uploads, photos: initialPhotos } };

		describe('SET_CURRENTPAGE', () => {
			it('does not set currentPage when given a function that goes out of bounds', () => {
				const testCurrentPage1 = () => testPageCount + 1;
				const action1 = { payload: { currentPage: testCurrentPage1 }, type: ACTIONS.SET_CURRENTPAGE };

				const testCurrentPage2 = () => -1;
				const action2 = { payload: { currentPage: testCurrentPage2 }, type: ACTIONS.SET_CURRENTPAGE };

				const state1 = globalReducer(initState, action1);
				expect(state1).toBe(initState);
				expect(state1.uploads.currentPage).toBe(0);

				const state2 = globalReducer(initState, action2);
				expect(state2).toBe(initState);
				expect(state2.uploads.currentPage).toBe(0);
			});

			it('sets currentPage correctly when given a function', () => {
				const testPageNumber = 4;
				const testCurrentPage = () => testPageNumber;
				const action = { payload: { currentPage: testCurrentPage }, type: ACTIONS.SET_CURRENTPAGE };

				const state = globalReducer(initState, action);
				expect(state.uploads.currentPage).toBe(testPageNumber);
			});
	
			it('sets currentPage correctly when given a number', () => {
				const testCurrentPage = 3;
				const action = { payload: { currentPage: testCurrentPage }, type: ACTIONS.SET_CURRENTPAGE };

				const state = globalReducer(initState, action);
				expect(state.uploads.currentPage).toBe(3);
			});
		});

		describe('SET_CURRENTPAGE_FIRST', () => {
			it('sets currentPage to the first page', () => {
				const action = { type: ACTIONS.SET_CURRENTPAGE_FIRST };
				const stateNotOnFirstPage = { ...initState, uploads: { ...initState.uploads, currentPage: 1 } };

				expect(stateNotOnFirstPage.uploads.currentPage).toBe(1);
				const state = globalReducer(stateNotOnFirstPage, action);
				expect(state.uploads.currentPage).toBe(0);
			});
		});

		describe('SET_CURRENTPAGE_LAST', () => {
			it('sets currentPage to the last page', () => {
				const action = { type: ACTIONS.SET_CURRENTPAGE_LAST };

				const state = globalReducer(initState, action);
				expect(state.uploads.currentPage).toBe(testPageCount - 1);
			});
		});

		describe('DECREMENT_CURRENTPAGE', () => {
			it('does not set currentPage when it goes out of bounds', () => {
				const action = { type: ACTIONS.DECREMENT_CURRENTPAGE };

				expect(initState.uploads.currentPage).toBe(0);
				const state = globalReducer(initState, action);
				expect(state.uploads.currentPage).toBe(0);
			});

			it('sets currentPage to currentPage - 1', () => {
				const action = { type: ACTIONS.DECREMENT_CURRENTPAGE };
				const stateNotOnFirstPage = { ...initState, uploads: { ...initState.uploads, currentPage: 1 } };

				expect(stateNotOnFirstPage.uploads.currentPage).toBe(1);
				const state = globalReducer(stateNotOnFirstPage, action);
				expect(state.uploads.currentPage).toBe(0);
			});
		});

		describe('INCREMENT_CURRENTPAGE', () => {
			it('does not set currentPage when it goes out of bounds', () => {
				const action = { type: ACTIONS.INCREMENT_CURRENTPAGE };
				const stateNotOnFirstPage = { ...initState, uploads: { ...initState.uploads, currentPage: testPageCount - 1 } };

				expect(stateNotOnFirstPage.uploads.currentPage).toBe(testPageCount - 1);
				const state = globalReducer(stateNotOnFirstPage, action);
				expect(state.uploads.currentPage).toBe(testPageCount - 1);
			});

			it('sets currentPage to currentPage + 1', () => {
				const action = { type: ACTIONS.INCREMENT_CURRENTPAGE };

				expect(initState.uploads.currentPage).toBe(0);
				const state = globalReducer(initState, action);
				expect(state.uploads.currentPage).toBe(1);
			});
		});
	});

	describe('multiselect', () => {
		describe('CLEAR_MULTISELECT', () => {
			it('set ids to an empty array', () => {
				const action = { type: ACTIONS.CLEAR_MULTISELECT };
				const stateWithIds = {
					...initialState,
					uploads: {
						...initialState.uploads,
						multiselect: {
							ids: [ '1', '2', '3', '4', '5' ],
						},
					},
				};

				expect(stateWithIds.uploads.multiselect.ids).not.toHaveLength(0);
				const state = globalReducer(stateWithIds, action);
				expect(state.uploads.multiselect.ids).toHaveLength(0);
			});
		});

		describe('TOGGLE_MULTISELECT', () => {
			it('enables and disables multiselect', () => {
				const action = { type: ACTIONS.TOGGLE_MULTISELECT };

				const state1 = globalReducer(initialState, action);
				expect(state1.uploads.multiselect.isEnabled).toBe(true);

				const state2 = globalReducer(state1, action);
				expect(state2.uploads.multiselect.isEnabled).toBe(false);
			});
		});

		describe('TOGGLE_MULTISELECT_ID', () => {
			it('adds and removes the given photoId', () => {
				const testPhotoId = 'photo1';
				const action = { payload: { photoId: testPhotoId }, type: ACTIONS.TOGGLE_MULTISELECT_ID };

				expect(initialState.uploads.multiselect.ids).toHaveLength(0);

				const state1 = globalReducer(initialState, action);
				expect(state1.uploads.multiselect.ids).toEqual([testPhotoId])

				const state2 = globalReducer(state1, action);
				expect(state2.uploads.multiselect.ids).toHaveLength(0);
			});
		});
	});

	describe('photos', () => {
		describe('ADD_PHOTOS', () => {
			it('adds photos and places correctly', () => {
				const place1 = { placeId: 'place1', name: 'Place 1', languageCode: 'en' };
				const place4 = { placeId: 'place4', name: 'Place 4', languageCode: 'en' };

				const photo1 = { photoId: { id: 'photo1' }, places: [place1] };
				const photo2 = { photoId: { id: 'photo2' } };
				const photo3 = { photoId: { id: 'photo3'} };
				const photo4 = { photoId: { id: 'photo4' }, places: [place4] };

				const newPhotosPage1 = [photo1, photo2];
				const newPhotosPage2 = [photo3, photo4];
				const newPhotosAll = [...newPhotosPage1, ...newPhotosPage2];
	
				const action1 = { payload: { photos: newPhotosPage1 }, type: ACTIONS.ADD_PHOTOS };
				const action2 = { payload: { photos: newPhotosPage2 }, type: ACTIONS.ADD_PHOTOS };
	
				const state1 = globalReducer(initialState, action1);
				expect(state1.uploads.photos).toEqual(newPhotosPage1);
				expect(state1.uploads.places[place1.placeId]).toEqual(place1);
	
				const state2 = globalReducer(state1, action2);
				expect(state2.uploads.photos).toEqual(newPhotosAll);
				expect(state2.uploads.places[place4.placeId]).toEqual(place4);
			});

			it('does not add duplicate photos', () => {
				const photo1 = { photoId: { id: 'photo1' } };
				const photo2 = { photoId: { id: 'photo2' } };

				const action = { payload: { photos: [photo1, photo2] }, type: ACTIONS.ADD_PHOTOS };

				const state1 = globalReducer(initialState, action);
				const photos1 = state1.uploads.photos;
				expect(photos1.find((p) => p.photoId.id === photo1.photoId.id)).not.toBeUndefined();
				expect(photos1.find((p) => p.photoId.id === photo2.photoId.id)).not.toBeUndefined();
				expect(state1.uploads.photos).toHaveLength(2);

				const state2 = globalReducer(state1, action);
				const photos2 = state2.uploads.photos;
				expect(photos2.find((p) => p.photoId.id === photo1.photoId.id)).not.toBeUndefined();
				expect(photos2.find((p) => p.photoId.id === photo2.photoId.id)).not.toBeUndefined();
				expect(state2.uploads.photos).toHaveLength(2);
			});
		});

		describe('DELETE_PHOTOS', () => {
			it('removes photos whose ids match those provided in the action', () => {
				const action = { payload: { photoIds: ['photo1', 'photo3'] }, type: ACTIONS.DELETE_PHOTOS };
				const initPhotos = [
					{ photoId: { id: 'photo1' } },
					{ photoId: { id: 'photo2' } },
					{ photoId: { id: 'photo3' } },
				];
				const initState = { ...initialState, uploads: { ...initialState.uploads, photos: initPhotos } };
				const expectedPhotos = [{ photoId: { id: 'photo2' } }];

				const state = globalReducer(initState, action);
				expect(state.uploads.photos).toEqual(expectedPhotos);
			});
		});

		describe('SORT_PHOTOS', () => {
			it('sorts photos according to the provided function', () => {
				const testSortFunc1 = (a, b) => a.captureTime < b.captureTime ? -1 : a.captureTime > b.captureTime ? 1 : 0;
				const action1 = { payload: { sortFunc: testSortFunc1 }, type: ACTIONS.SORT_PHOTOS };

				const testSortFunc2 = (a, b) => a.uploadTime < b.uploadTime ? -1 : a.uploadTime > b.uploadTime ? 1 : 0;
				const action2 = { payload: { sortFunc: testSortFunc2 }, type: ACTIONS.SORT_PHOTOS };

				const action3 = { payload: { sortProp: 'captureTime' }, type: ACTIONS.SORT_PHOTOS };

				const action4 = { payload: { reverse: true, sortProp: 'captureTime' }, type: ACTIONS.SORT_PHOTOS };

				const photo1 = { captureTime: '2004-01-01T00:00:00Z', uploadTime: '2005-01-01T00:00:00Z' };
				const photo2 = { captureTime: '2003-01-01T00:00:00Z', uploadTime: '2004-01-01T00:00:00Z' };
				const photo3 = { captureTime: '2001-01-01T00:00:00Z', uploadTime: '2003-01-01T00:00:00Z' };
				const photo4 = { captureTime: '2002-01-01T00:00:00Z', uploadTime: '2002-01-01T00:00:00Z' };
				const photo5 = { captureTime: '2005-01-01T00:00:00Z', uploadTime: '2001-01-01T00:00:00Z' };

				const testPhotos = [photo1, photo2, photo3, photo4, photo5];
				const stateWithPhotos = { ...initialState, uploads: { ...initialState.uploads, photos: testPhotos } };

				const state1 = globalReducer(stateWithPhotos, action1);
				expect(state1.uploads.photos[0]).toBe(photo3);
				expect(state1.uploads.photos[1]).toBe(photo4);
				expect(state1.uploads.photos[2]).toBe(photo2);
				expect(state1.uploads.photos[3]).toBe(photo1);
				expect(state1.uploads.photos[4]).toBe(photo5);

				const state2 = globalReducer(stateWithPhotos, action2);
				expect(state2.uploads.photos[0]).toBe(photo5);
				expect(state2.uploads.photos[1]).toBe(photo4);
				expect(state2.uploads.photos[2]).toBe(photo3);
				expect(state2.uploads.photos[3]).toBe(photo2);
				expect(state2.uploads.photos[4]).toBe(photo1);

				const state3 = globalReducer(stateWithPhotos, action3);
				expect(state3.uploads.photos[0]).toBe(photo3);
				expect(state3.uploads.photos[1]).toBe(photo4);
				expect(state3.uploads.photos[2]).toBe(photo2);
				expect(state3.uploads.photos[3]).toBe(photo1);
				expect(state3.uploads.photos[4]).toBe(photo5);

				const state4 = globalReducer(stateWithPhotos, action4);
				expect(state4.uploads.photos[0]).toBe(photo5);
				expect(state4.uploads.photos[1]).toBe(photo1);
				expect(state4.uploads.photos[2]).toBe(photo2);
				expect(state4.uploads.photos[3]).toBe(photo4);
				expect(state4.uploads.photos[4]).toBe(photo3);
			});
		});

		describe('UPDATE_PHOTO', () => {
			it('adds photo if photos are null', () => {
				const testPhoto = { photoId: { id: 'photo1' }, places: [{ name: 'testPlace' }] };

				const action = {
					payload: {
						updatedPhoto: testPhoto
					},
					type: ACTIONS.UPDATE_PHOTO,
				};

				const state = globalReducer(initialState, action);

				const foundPhoto = state.uploads.photos[0];
				expect(foundPhoto).toBe(testPhoto);

				expect(Object.keys(state.uploads.places).length).toBeGreaterThan(0);
			});

			it('adds photo if it does not already exist', () => {
				const initialPhotos = [{ photoId: { id: 'photo1' } }, { photoId: { id: 'photo2' } }];
				const initState = { ...initialState, uploads: { ...initialState.uploads, photos: initialPhotos } };
				const testPhotoId = 'photo3';

				const action = {
					payload: {
						updatedPhoto: {
							photoId: { id: testPhotoId }
						},
					},
					type: ACTIONS.UPDATE_PHOTO,
				};

				expect(initState.uploads.photos).toHaveLength(2);

				const state = globalReducer(initState, action);
				const foundPhoto = state.uploads.photos.find((photo) => photo.photoId.id === testPhotoId);

				expect(state.uploads.photos).toHaveLength(3);
				expect(foundPhoto).not.toBeNull();
			});
	
			it('updates photo if it already exists', () => {
				const initialPhotos = [{ photoId: { id: 'photo1' } }, { photoId: { id: 'photo2' } }];
				const initState = { ...initialState, uploads: { ...initialState.uploads, photos: initialPhotos } };
				const testConnections = ['connection 1', 'connection 2'];
				const testPhotoId = 'photo2';

				const action = {
					payload: {
						updatedPhoto: {
							connections: testConnections,
							photoId: { id: testPhotoId },
						},
					},
					type: ACTIONS.UPDATE_PHOTO,
				};

				const foundPhotoInit = initState.uploads.photos.find((photo) => photo.photoId.id === testPhotoId);
				expect(initState.uploads.photos).toHaveLength(2);
				expect(foundPhotoInit.connections).toBeUndefined();

				const state = globalReducer(initState, action);
				const foundPhoto = state.uploads.photos.find((photo) => photo.photoId.id === testPhotoId);

				expect(state.uploads.photos).toHaveLength(2);
				expect(foundPhoto).not.toBeNull();
				expect(foundPhoto.connections).toEqual(testConnections);
			});
		});

		describe('thumbnails', () => {
			describe('SET_THUMBNAIL_DATA', () => {
				it('populates thumbnails correctly', () => {
					const testDataUrl = 'blob:http://localhost:3000/some-guid';
					const testPhotoId = 'photo1';
					const action = { payload: { dataUrl: testDataUrl, photoId: testPhotoId }, type: ACTIONS.SET_THUMBNAIL_DATA };

					const state = globalReducer(initialState, action);
					expect(state.uploads.thumbnails[testPhotoId]).toBe(testDataUrl);
				});
			});
		});
	});
});
