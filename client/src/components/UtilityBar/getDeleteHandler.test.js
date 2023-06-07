import { initialState } from '../../components/GlobalState';

import getDeleteHandler from './getDeleteHandler';

import { ACTIONS } from '../GlobalState/reducers/global';

jest.mock('../../utilities', () => ({
	ACTIONS: { DELETE_PHOTOS: 'DELETE_PHOTOS' },
	fetcher: async () => ({ json: async () => ({ status: [{}, {}] }) }),
}));

describe('handleDelete', () => {
	const dispatchMock = jest.fn();

	it('does not call dispatch with initial state' , async () => {
		const handleDelete = getDeleteHandler(dispatchMock, initialState);

		await handleDelete();

		expect(dispatchMock).not.toHaveBeenCalled();
	});

	it('calls dispatch with multiselect ids' , async () => {
		const photos = [
			{ photoId: { id: 'photo1' } },
			{ photoId: { id: 'photo2' } },
			{ photoId: { id: 'photo3' } },
		];
		const selectedIds = ['photo1', 'photo2'];
		const initState = {
			...initialState,
			uploads: {
				...initialState.uploads,
				multiselect: {
					ids: selectedIds,
				},
				photos,
			},
		};

		const handleDelete = getDeleteHandler(dispatchMock, initState);

		await handleDelete();

		expect(dispatchMock).toHaveBeenCalledWith({ payload: { photoIds: selectedIds }, type: ACTIONS.DELETE_PHOTOS });
	});
});
