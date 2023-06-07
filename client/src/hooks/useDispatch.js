import { useContext } from 'react';
import GlobalState from '../components/GlobalState';

export default function useDispatch() {
	const { dispatch } = useContext(GlobalState);

	return dispatch;
}
