import { put, call, takeEvery } from 'redux-saga/effects';

export default function* request() {
  yield takeEvery(ActionTypes.REQUEST, function* (requestAction) {
    const { data, success, error, start, callback } = requestAction.payload;

    if (start) {
      yield put({
        type: start,
        payload: data
      });
    }

    try {
      const ret = yield call(Util.requestApi.bind(Util), data);
      typeof callback === 'function' && callback(ret);

      if (success) {
        yield put({
          type: success,
          payload: { ...ret, _data: data }
        });
      }
    } catch (e) {
      if (error) {
        yield put({
          type: error,
          payload: { ...ret }
        });
      }
    }
  });
}
