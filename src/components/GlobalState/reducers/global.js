import { toast } from "react-toastify";

export const ACTIONS = {
	ADD_PHOTOS: 'ADD_PHOTOS',
	CLEAR_MULTISELECT: 'CLEAR_MULTISELECT',
	DECREMENT_CURRENTPAGE: 'DECREMENT_CURRENTPAGE',
	DELETE_PHOTOS: 'DELETE_PHOTOS',
	INCREMENT_CURRENTPAGE: 'INCREMENT_CURRENTPAGE',
	SET_CURRENTPAGE: 'SET_CURRENTPAGE',
	SET_CURRENTPAGE_FIRST: 'SET_CURRENTPAGE_FIRST',
	SET_CURRENTPAGE_LAST: 'SET_CURRENTPAGE_LAST',
	SET_FETCHER: 'SET_FETCHER',
	SET_GITHASH: 'SET_GITHASH',
	SET_ISAUTHED: 'SET_ISAUTHED',
	SET_MODAL: 'SET_MODAL',
	SET_SHOWLOADER: 'SET_SHOWLOADER',
	SET_THUMBNAIL_DATA: 'SET_THUMBNAIL_DATA',
	SORT_PHOTOS: 'SORT_PHOTOS',
	TOGGLE_MULTISELECT: 'TOGGLE_MULTISELECT',
	TOGGLE_MULTISELECT_ID: 'TOGGLE_MULTISELECT_ID',
	UPDATE_PHOTO: 'UPDATE_PHOTO',
};

export default function globalReducer(state, action) {
	try {
		const { payload, type: actionType } = action;

		switch (actionType) {
			case ACTIONS.ADD_PHOTOS: {
				const { photos } = payload;

				const newPhotos = [ ...state.uploads.photos ?? [] ];
				photos.forEach((photoToAdd) => {
					const existingPhotoIdx = newPhotos.findIndex((existingPhoto) => existingPhoto.photoId.id === photoToAdd.photoId.id);
					if (existingPhotoIdx === -1) {
						newPhotos.push(photoToAdd);
					} else {
						newPhotos[existingPhotoIdx] = photoToAdd;
					}
				});

				const newUploads = { ...state.uploads, photos: newPhotos };

				newUploads.places = newUploads.photos.reduce((acc, photo) => {
					const { places } = photo;
					places?.forEach((place) => {
						const { placeId } = place;
						if (!acc[placeId]) {
							acc[placeId] = place;
						}
					});
					return acc;
				}, {});

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.CLEAR_MULTISELECT: {
				const newMultiselect = { ...state.uploads.multiselect, ids: [] };
				const newUploads = { ...state.uploads, multiselect: newMultiselect };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.DECREMENT_CURRENTPAGE: {
				const { uploads: { currentPage: oldCurrentPage } } = state;

				if (oldCurrentPage <= 0) {
					return state;
				}

				const newUploads = { ...state.uploads, currentPage: oldCurrentPage - 1 };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.DELETE_PHOTOS: {
				const { photoIds } = payload;
				
				if (photoIds.length <= 0) {
					console.error('Unexpectedly did not update state', action);
					return state;
				}

				const newPhotos = state.uploads.photos.filter((photo) => {
					const { photoId: { id } } = photo;

					return !photoIds.includes(id);
				});

				if (newPhotos.length === state.uploads.photos.length) {
					console.error('Unexpectedly did not update state', action);
					return state;
				}

				const newUploads = { ...state.uploads, photos: newPhotos };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.INCREMENT_CURRENTPAGE: {
				const { uploads: { currentPage: oldCurrentPage, photos, photosPerPage } } = state;
				const pageCount = Math.ceil(photos.length / photosPerPage);

				if (oldCurrentPage >= pageCount - 1) {
					return state;
				}

				const newUploads = { ...state.uploads, currentPage: oldCurrentPage + 1 };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.SET_CURRENTPAGE: {
				const { uploads: { currentPage: oldCurrentPage, photos, photosPerPage } } = state;
				const { currentPage } = payload;

				const pageCount = Math.ceil(photos.length / photosPerPage);

				let newCurrentPage;
				if (typeof currentPage === 'function') {
					newCurrentPage = currentPage({ currentPage: oldCurrentPage, pageCount });
				} else {
					newCurrentPage = currentPage;
				}

				if (newCurrentPage < 0 || newCurrentPage >= pageCount) {
					return state;
				}

				const newUploads = { ...state.uploads, currentPage: newCurrentPage };
				return { ...state, uploads: newUploads };
			}

			case ACTIONS.SET_CURRENTPAGE_FIRST: {
				const newUploads = { ...state.uploads, currentPage: 0 };
				return { ...state, uploads: newUploads };
			}

			case ACTIONS.SET_CURRENTPAGE_LAST: {
				const { uploads: { photos, photosPerPage } } = state;

				const pageCount = Math.ceil(photos.length / photosPerPage);

				const newUploads = { ...state.uploads, currentPage: pageCount - 1 };
				return { ...state, uploads: newUploads };
			}

			case ACTIONS.SET_FETCHER: {
				const { inProgress, type } = payload;

				const newFetcher = { ...state.fetcher, [type]: { inProgress } };

				return { ...state, fetcher: newFetcher };
			}

			case ACTIONS.SET_GITHASH: {
				const { gitHash } = payload;

				const newMeta = { ...state.meta, gitHash };

				return { ...state, meta: newMeta };
			}

			case ACTIONS.SET_ISAUTHED: {
				const { isAuthed } = payload;

				return { ...state, isAuthed };
			}

			case ACTIONS.SET_MODAL: {
				const { form } = payload;

				const newModal = { ...state.modal, form };

				return { ...state, modal: newModal };
			}

			case ACTIONS.SET_SHOWLOADER: {
				const { showLoader } = payload;

				return { ...state, showLoader };
			}

			case ACTIONS.SET_THUMBNAIL_DATA: {
				const { dataUrl, photoId } = payload;

				const newThumbnails = { ...state.uploads.thumbnails, [photoId]: dataUrl };
				const newUploads = { ...state.uploads, thumbnails: newThumbnails };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.SORT_PHOTOS: {
				const { reverse, sortFunc, sortProp } = payload;

				const newPhotos = [ ...state.uploads.photos ];
				if (sortFunc) {
					newPhotos.sort(sortFunc);
				} else {
					newPhotos.sort((a, b) => a[sortProp] < b[sortProp] ? -1 : a[sortProp] > b[sortProp] ? 1 : 0);
				}

				if (reverse) {
					newPhotos.reverse();
				}

				const newUploads = { ...state.uploads, photos: newPhotos };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.TOGGLE_MULTISELECT: {
				const { uploads: { multiselect: { isEnabled } } } = state;

				const newMultiselect = { ...state.uploads.multiselect, isEnabled: !isEnabled };
				const newUploads = { ...state.uploads, multiselect: newMultiselect };

				return { ...state, uploads: newUploads };
			}

			case ACTIONS.TOGGLE_MULTISELECT_ID: {
				const { uploads: { multiselect: { ids } } } = state;
				const { photoId } = payload;

				let newIds;
				const curIndex = ids.indexOf(photoId);
				if (curIndex === -1) {
					newIds = [...ids, photoId];
				} else {
					newIds = ids.filter((id) => id !== photoId);
				}

				const newMultiselect = { ...state.uploads.multiselect, ids: newIds };
				const newUploads = { ...state.uploads, multiselect: newMultiselect };
				return { ...state, uploads: newUploads };
			}

			case ACTIONS.UPDATE_PHOTO: {
				const { uploads: { photos } } = state;
				const { updatedPhoto } = payload;

				const newPhotos = photos ? [ ...photos ] : [];

				const photoIdx = newPhotos.findIndex((photo) => photo.photoId.id === updatedPhoto.photoId.id);
				if (photoIdx === -1) {
					newPhotos.push(updatedPhoto);
				} else {
					newPhotos[photoIdx] = updatedPhoto;
				}

				const newUploads = { ...state.uploads, photos: newPhotos };
				return { ...state, uploads: newUploads };
			}

			default: {
				return state;
			}
		}
	} catch(e) {
		console.error(e);
		toast('Dispatch failed, check log for details');

		return state;
	}
};
