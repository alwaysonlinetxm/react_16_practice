import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import createReducer from '../reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

import Immutable from 'seamless-immutable';

const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  process.browser && window.devToolsExtension ? window.devToolsExtension() : f => f
);

// will cover the initState in reducer
const initialState = Immutable(process.browser ? window.SERVER_INIT_STATE || {} : {});

export function createAppStore(initState = initialState) {
  const store = createStore(createReducer(), initState, enhancer);
  store.asyncReducers = {};
  store.asyncSagas = {};
  sagaMiddleware.run(rootSaga, store.dispatch);

  return store;
}

export function injectAsyncReducer(store, asyncReducers) {
  Object.assign(store.asyncReducers, asyncReducers);
  store.replaceReducer(createReducer(store.asyncReducers));
}

export function injectAsyncSaga(store, asyncSagas) {
  for (const key in asyncSagas) {
    if (!store.asyncSagas.hasOwnProperty(key)) {
      sagaMiddleware.run(asyncSagas[key]);
      store.asyncSagas[key] = true;
    }
  }
}
