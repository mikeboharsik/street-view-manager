import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { GlobalStateProvider } from '../GlobalState';

import { getFeatureFlags } from '../../utilities';

import { Landing, OAuth, PhotoEditor, PhotoUploader, UtilityBar } from '..';

import { Footer, Loader, Modal } from '.';

import './App.css';
import 'react-toastify/dist/ReactToastify.css'

window.SVM = {
  featureFlags: getFeatureFlags(),
};

export default function App() {
  return (
    <div className="App">
      <Router>
        <GlobalStateProvider>
          <ToastContainer position={'top-center'} theme={'dark'} />
          <Loader />
          <Footer />
          <UtilityBar />
          <Modal />
          <Switch>
            <Route path="/photo/:photoId" component={PhotoEditor} exact />
            <Route path="/upload" component={PhotoUploader} exact />
            <Route path="/oauth" component={OAuth} exact />
            <Route path="/" component={Landing} />
          </Switch>
        </GlobalStateProvider>
      </Router>
    </div>
  );
}
