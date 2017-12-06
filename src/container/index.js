import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Promise from 'promise-polyfill';

import { createAppRoutes, createAppStore } from './app';

import './reset.scss';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

window.clientStore = createAppStore();

ReactDOM.render(
  <Provider store={ window.clientStore }>
    <Router history={ browserHistory } routes={ createAppRoutes(window.clientStore) } />
  </Provider>,
  document.querySelector('#app')
);
