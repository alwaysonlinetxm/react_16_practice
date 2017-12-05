import { take, put } from 'redux-saga/effects';

import ActionTypes from '../constants/ActionTypes';
import actions from '../actions/actions';

const { request } = actions;

export function* getTask() {
  while(true) {
    const action = yield take(ActionTypes.GET_TASK);
    yield put(request({
      data: {
        task: [ 'demaxiya1', 'damexiya2' ]
      },
      success: ActionTypes.GET_TASK_SUCC,
      callback: action.payload && action.payload.cb
    }));
  }
}
