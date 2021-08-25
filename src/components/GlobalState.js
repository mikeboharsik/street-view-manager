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
		photos: [],
		photosPerPage: 9,
	},
};

const GlobalState = React.createContext();

export default GlobalState;
