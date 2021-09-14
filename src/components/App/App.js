import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { GlobalStateProvider, initialState } from '../GlobalState';
import checkAccessToken from '../../utilities/checkAccessToken';

import { Landing, OAuth, PhotoEditor, PhotoUploader, UtilityBar } from '..';

import { Footer, Loader } from '.';

import './App.css';
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const [state, setState] = useState(initialState);

  const haveAccessToken = checkAccessToken();
  if (!haveAccessToken) {
    return null;
  } else if (!state.isAuthed) {
    setState((prev) => ({ ...prev, isAuthed: true }));
  }

  return (
    <div className="App">
      <GlobalStateProvider value={{ setState, ...state }}>
        <ToastContainer position={'top-center'} theme={'dark'} />
        <Loader />
        <Router>
          <Footer />
          <UtilityBar />
          <Switch>
            <Route path="/photoEditor/:photoId" component={PhotoEditor} exact />
            <Route path="/photoUploader" component={PhotoUploader} exact />
            <Route path="/oauth" component={OAuth} exact />
            <Route path="/" component={Landing} />
          </Switch>
        </Router>
      </GlobalStateProvider>
    </div>
  );
}
