import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import GlobalState, { initialState } from './components/GlobalState';

import { Landing, OAuth, PhotoEditor } from './components';
import { getCookie } from './hooks/useCookies';

import './App.css';

function LoaderContainer({ state }) {
  const { showLoader } = state;

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
  const access_token = getCookie('access_token');
  if (!access_token) {
    const baseUri = 'https://accounts.google.com/o/oauth2/v2/auth';
    const parameters = {
      scope: 'https://www.googleapis.com/auth/streetviewpublish',
      access_type: 'online',
      include_granted_scopes: 'true',
      response_type: 'token',
      redirect_uri: `http://${window.location.host}/oauth`,
      client_id: '927910378932-7gbkkgr02ptrvl577flg6k38a90pq2nr.apps.googleusercontent.com',
    };

    const params = Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&');

    const url = `${baseUri}?${params}`;

    window.location.href = url;
  }

  const [state, setState] = useState(initialState);

  return (
    <div className="App">
      <LoaderContainer state={state} />
      <GlobalState.Provider value={{ setState, ...state }}>
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
