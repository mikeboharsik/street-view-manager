import React from 'react';

export const initialState = {
	fetcher: {
		photo: {
			inProgress: null,
		},
		photos: {
			inProgress: null,
		},
	},
	isAuthed: false,
	showLoader: false,
	uploads: {
		currentPage: 0,
		multiselect: {
			ids: [],
			isEnabled: false,
		},
		photos: null,
		photosPerPage: 9,
		places: {},
	},
};

const GlobalState = React.createContext();

export default GlobalState;
