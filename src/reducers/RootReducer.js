import { combineReducers } from 'redux';

import topbar from './TopbarReducer';

export default function createReducer(asyncReducers) {
  return combineReducers({
    topbar,
    ...asyncReducers
  });
}
