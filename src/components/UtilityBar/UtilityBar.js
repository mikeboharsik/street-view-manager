import { useContext } from 'react';
import { useLocation } from 'react-router';

import { Gear, X } from '../icons';
import GlobalState from '../GlobalState';
import { useIsAuthed } from '../../hooks';
import { FEATURE_FLAGS, getFeatureFlags } from '../../utilities';

import { ACTIONS } from '../GlobalState/reducers/global';

import { selectMultiselect } from '../GlobalState/selectors/selectUploads';

import getConnectHandler from './getConnectHandler';
import getDeleteHandler from './getDeleteHandler';
import getUpdateLevelHandler from './getUpdateLevelHandler';
import getUpdatePlacesHandler from './getUpdatePlacesHandler';

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
			<div style={{ borderTop: '1px solid black', marginBottom: '4px', marginTop: '8px' }} />
			<div className={functionClassName} onClick={getConnectHandler(state)}>Con</div>
			<div className={functionClassName} onClick={getUpdatePlacesHandler(state)}>Places</div>
			<div className={functionClassName} onClick={getUpdateLevelHandler(state)}>Level</div>
			<div className={functionClassName} onClick={getDeleteHandler(dispatch, state)}>Delete</div>
			<div className={functionClassName} onClick={() => dispatch({ type: ACTIONS.CLEAR_MULTISELECT })}>{`Clear (${ids.length})`}</div>
		</div>
	);
}

export default function UtilityBar() {
	const { dispatch, state } = useContext(GlobalState);
	const { showLoader } = state;
	const { isEnabled: isMultiselectEnabled } = selectMultiselect(state);

	const isAuthed = useIsAuthed();

	const { pathname } = useLocation();
	const { isEnabled: isFeatureEnabled } = getFeatureFlags();

	const isUtilityBarEnabled = isFeatureEnabled(FEATURE_FLAGS.UTILITY_BAR);

	if (!isAuthed || !isUtilityBarEnabled || showLoader || pathname !== '/') {
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
