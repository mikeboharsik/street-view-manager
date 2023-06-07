import { useContext } from 'react';
import GlobalState from '../components/GlobalState';

export default function useIsAuthed() {
	const { state: { isAuthed } } = useContext(GlobalState);

	return isAuthed;
}
