const initialState = {
	authFlow: {
		inProgress: null,
		error: null,
	},
	fetcher: {
		gitHash: {
			inProgress: null,
		},
		photo: {
			inProgress: null,
		},
		photos: {
			inProgress: null,
		},
	},
	meta: {
		gitHash: null,
	},
	modal: {
		form: null,
	},
	isAuthed: null,
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
		thumbnails: {},
	},
};

export default initialState;
