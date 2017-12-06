import { take, put } from 'redux-saga/effects';

import ActionTypes from '../constants/ActionTypes';
import actions from '../actions/actions';

const { request } = actions;

export function* getHomeText() {
  while(true) {
    const action = yield take(ActionTypes.GET_HOME_TEXT);
    yield put(request({
      data: {
        text: 'this is home'
      },
      success: ActionTypes.GET_HOME_TEXT_SUCC,
      callback: action.payload && action.payload.cb
    }));
  }
}
