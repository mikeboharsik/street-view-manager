import { useContext } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

import GlobalState from '../GlobalState';

import './Loader.css';

export default function Loader() {
  const { showLoader } = useContext(GlobalState);

  if (showLoader) {
    return (
      <div id="loader-container">
        <PulseLoader color="white" />
      </div>
    );
  }

  return null;
}
