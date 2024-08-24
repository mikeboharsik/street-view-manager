import { useContext } from 'react';
import { useLocation } from 'react-router';

import { Gear, X } from '../icons';
import GlobalState from '../GlobalState';
import { useIsAuthed } from '../../hooks';

import { ACTIONS } from '../GlobalState/reducers/global';

import { selectMultiselect } from '../GlobalState/selectors/selectUploads';

import getConnectHandler from './getConnectHandler';
import getDeleteHandler from './getDeleteHandler';
import getUpdateLevelHandler from './getUpdateLevelHandler';

import { FEATURE_FLAGS, getFeatureFlag } from '../../utilities';

import PhotoPlaces from '../forms/PhotoPlaces';

import './UtilityBar.css';

function Functions() {
	const { dispatch, state } = useContext(GlobalState);
	const { ids, isEnabled } = selectMultiselect(state);

	const functionClassName = `utilityBar-function-${isEnabled ? 'active' : 'inactive'}`;

	if (!isEnabled) {
		return null;
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<div className="utilityBar-separator" />

			{/*
			<div className={functionClassName} onClick={getConnectHandler(state)} title="Set connections">Con</div>
			<div className={functionClassName} onClick={() => dispatch({ payload: { form: <PhotoPlaces /> }, type: ACTIONS.SET_MODAL })} title="Set places">Places</div>
			<div className={functionClassName} onClick={getUpdateLevelHandler(state)} title="Set level">Level</div>
			*/}
			<div className={functionClassName} onClick={getDeleteHandler(dispatch, state)} title="Delete photos">Delete</div>

			{getFeatureFlag(FEATURE_FLAGS.MODAL_TEST) && <div className={functionClassName} onClick={() => dispatch({ payload: { form: <PhotoPlaces /> }, type: ACTIONS.SET_MODAL })} title="Test modal">Modal</div>}

			<div className="utilityBar-separator" />

			<div className={functionClassName} onClick={() => dispatch({ type: ACTIONS.CLEAR_MULTISELECT })} title="Clear selection">
				{`Clear (${ids.length})`}
			</div>
		</div>
	);
}

export default function UtilityBar() {
	const { dispatch, state } = useContext(GlobalState);
	const { showLoader } = state;
	const { isEnabled: isMultiselectEnabled } = selectMultiselect(state);

	const isAuthed = useIsAuthed();

	const { pathname } = useLocation();

	if (!isAuthed || showLoader || pathname !== '/') {
		return null;
	}

	const className = `utilityBar-container-${isMultiselectEnabled ? 'active' : 'inactive'}`;

	const Indicator = isMultiselectEnabled ? X : Gear;

	return (
		<div className={className} id="utilityBar-container">
			<Indicator onClick={() => dispatch({ type: ACTIONS.TOGGLE_MULTISELECT })} style={{ cursor: 'pointer' }} />

			<Functions />
		</div>
	);
}
