import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Promise from 'promise-polyfill';

import { route } from './route';
// import Root from './Root';
import Store from '../store/Store';

import './reset.scss';

// To add to window
if (process.browser && !window.Promise) {
  window.Promise = Promise;
}

ReactDOM.render(
  <Provider store={ Store }>
    <Router history={ browserHistory } routes={ route } />
  </Provider>,
  document.querySelector('#app')
);
