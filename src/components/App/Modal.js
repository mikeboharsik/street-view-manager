import { useContext } from 'react';
import GlobalState from '../GlobalState';

import './Modal.css';

export default function Modal() {
	const { modal: { form }, setState } = useContext(GlobalState);

	const id = form ? 'modal-overlay-container-active' : 'modal-overlay-container';

	return (
		<div id={id} onClick={() => setState((prev) => ({ ...prev, modal: { form: null }}))}>
			<div id="modal-container" onClick={(e) => { e.stopPropagation() }}>
				{form}
			</div>
		</div>
	);
}
