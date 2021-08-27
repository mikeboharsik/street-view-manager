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
	showLoader: false,
	uploads: {
		currentPage: 0,
		photos: null,
		photosPerPage: 9,
		places: {},
	},
};

const GlobalState = React.createContext();

export default GlobalState;
