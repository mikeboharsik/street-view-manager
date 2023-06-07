import { useReducer } from 'react';

import GlobalState from './GlobalState';
import globalReducer from './reducers/global';
import { initialState } from '.';
import useAuth from '../../hooks/useAuth';

export default function GlobalStateProvider({ children }) {
	const [state, dispatch] = useReducer(globalReducer, initialState);

	useAuth(dispatch, state);

	return(
		<GlobalState.Provider value={{ dispatch, state }}>
			{children}
		</GlobalState.Provider>
	);
}
