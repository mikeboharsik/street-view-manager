import GlobalState from './GlobalState';

export default function GlobalStateProvider({ children, value }) {
	return(
		<GlobalState.Provider value={value}>
			{children}
		</GlobalState.Provider>
	);
}
