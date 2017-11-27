import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import Promise from 'promise-polyfill';

import Root from './Root';
import Store from '../store/Store';

import './reset.scss';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

const rootRoute = {
  path: '/',
  component: Root,
  indexRoute: require('../routes/task').default,
  childRoutes: [

  ]
};

ReactDOM.render(
  <Provider store={ Store }>
    <Router history={ hashHistory } routes={ rootRoute } />
  </Provider>,
  document.querySelector('#app')
);
