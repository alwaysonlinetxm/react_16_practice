import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import createReducer from '../reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

// will cover the initState in reducer
const initialState = {};
const store = createStore(createReducer(), initialState, enhancer);
store.asyncReducers = {};
store.asyncSagas = {};
sagaMiddleware.run(rootSaga, store.dispatch);

export function injectAsyncReducer(asyncReducers) {
  Object.assign(store.asyncReducers, asyncReducers);
  store.replaceReducer(createReducer(store.asyncReducers));
}

export function injectAsyncSaga(asyncSagas) {
  for (const key in asyncSagas) {
    if (!store.asyncSagas.hasOwnProperty(key)) {
      sagaMiddleware.run(asyncSagas[key]);
      store.asyncSagas[key] = true;
    }
  }
}

export default store;
