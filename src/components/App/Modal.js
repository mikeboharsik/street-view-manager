import { useContext } from 'react';
import GlobalState from '../GlobalState';
import { ACTIONS } from '../GlobalState/reducers/global';

import './Modal.css';

export default function Modal() {
	const { dispatch, state: { modal: { form } } } = useContext(GlobalState);

	const id = form ? 'modal-overlay-container-active' : 'modal-overlay-container';

	return (
		<div id={id} onClick={() => dispatch({ payload: { form: null }, type: ACTIONS.SET_MODAL })}>
			<div id="modal-container" onClick={(e) => { e.stopPropagation() }}>
				{form}
			</div>
		</div>
	);
}
