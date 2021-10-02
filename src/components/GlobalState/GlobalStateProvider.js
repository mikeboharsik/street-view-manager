import { useReducer } from 'react';

import GlobalState from './GlobalState';
import globalReducer from './reducers/global';
import { initialState } from '.';

export default function GlobalStateProvider({ children }) {
	const [state, dispatch] = useReducer(globalReducer, initialState);

	return(
		<GlobalState.Provider value={{ dispatch, state }}>
			{children}
		</GlobalState.Provider>
	);
}
