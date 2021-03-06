import { fork } from 'redux-saga/effects';

import request from './RequestSaga';
import * as home from './HomeSaga';
import * as task from './TaskSaga';

function* forkSaga(sagas) {
  for (const key in sagas) {
    yield fork(sagas[key]);
  }
}

export default function* rootSaga() {
  yield fork(request);
  yield* forkSaga(home);
  yield* forkSaga(task);
}
