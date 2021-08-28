import { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import GlobalState, { initialState } from './components/GlobalState';
import checkAccessToken from './utilities/checkAccessToken';

import { Landing, OAuth, PhotoEditor } from './components';

import './App.css';

function LoaderContainer() {
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

function App() {
  const [state, setState] = useState(initialState);

  const haveAccessToken = checkAccessToken();
  if (!haveAccessToken) {
    return null;
  } else {
    if (!state.isAuthed) {
      setState((prev) => ({ ...prev, isAuthed: true }));
    }
  }

  return (
    <div className="App">
      <GlobalState.Provider value={{ setState, ...state }}>
        <LoaderContainer />
        <Router>
          <Switch>
            <Route path="/photoEditor/:photoId" component={PhotoEditor} exact />
            <Route path="/oauth" component={OAuth} exact />
            <Route path="/" component={Landing} />
          </Switch>
        </Router>
      </GlobalState.Provider>
    </div>
  );
}

export default App;
