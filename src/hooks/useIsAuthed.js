import { useContext } from 'react';
import GlobalState from '../components/GlobalState';

export default function useIsAuthed() {
	const { isAuthed } = useContext(GlobalState);

	return isAuthed;
}