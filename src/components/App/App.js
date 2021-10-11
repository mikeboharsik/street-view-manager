import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { GlobalStateProvider } from '../GlobalState';

import { getFeatureFlags } from '../../utilities';

import { Landing, OAuth, PhotoEditor, PhotoUploader, UtilityBar } from '..';

import { Auth, Footer, Loader, Modal } from '.';

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
          <Auth />
          <ToastContainer position={'top-center'} theme={'dark'} />
          <Loader />
          <Footer />
          <UtilityBar />
          <Modal />
          <Switch>
            <Route path="/photoEditor/:photoId" component={PhotoEditor} exact />
            <Route path="/photoUploader" component={PhotoUploader} exact />
            <Route path="/oauth" component={OAuth} exact />
            <Route path="/" component={Landing} />
          </Switch>
        </GlobalStateProvider>
      </Router>
    </div>
  );
}
